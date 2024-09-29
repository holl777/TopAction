document.addEventListener('DOMContentLoaded', function () {
  // Attacher un événement click au bouton pour rafraîchir les données
  const refreshButton = document.getElementById('refreshData');
  refreshButton.addEventListener('click', fetchStockData);

  // Charger les données dès que la page est chargée
  fetchStockData();
});

// Fonction pour récupérer les données via l'API Yahoo Finance
async function fetchStockData() {
  const url = 'https://yahoo-finance-api-data.p.rapidapi.com/market/overview?category=markets&region=us'; 
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c057786f4emshedad8b594228880p11adb0jsn763d3994e6ab',
      'x-rapidapi-host': 'yahoo-finance-api-data.p.rapidapi.com'
    }
  };

  try {
    // Envoyer la requête et attendre la réponse
    const response = await fetch(url, options);

    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Convertir la réponse en JSON
    const result = await response.json();
    console.log(result);

    // Extraire les actions de la réponse
    const stocks = result.data.quotes; // Assurez-vous que les actions sont dans data.quotes

    // Appeler la fonction pour afficher les données récupérées
    displayStockChart(stocks);

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    document.getElementById('stockList').innerHTML = "Erreur lors de la récupération des données.";
  }
}

// Fonction pour afficher les données dans un graphique à barres
function displayStockChart(stocks) {
  // Vérifier si les données existent et contiennent des actions
  if (!stocks || stocks.length === 0) {
    document.getElementById('stockList').innerHTML = "Aucune donnée disponible.";
    return;
  }

  const labels = stocks.map(stock => stock.shortname || stock.symbol); // Récupérer les noms ou symboles des actions
  const prices = stocks.map(stock => stock.regularMarketPrice || 0); // Récupérer les prix ou définir à 0
  const changes = stocks.map(stock => stock.regularMarketChangePercent || 0); // Récupérer les pourcentages de changement ou définir à 0

  // Afficher la liste des actions et leurs variations
  let stockListHTML = stocks.map(stock => `
    <p>${stock.shortname || stock.symbol} : ${stock.regularMarketPrice || "N/A"} USD (${stock.regularMarketChangePercent || "N/A"}%)</p>
  `).join('');
  document.getElementById('stockList').innerHTML = stockListHTML;

  // Créer un graphique à barres avec Chart.js
  const ctx = document.getElementById('stockChart').getContext('2d');

  // Si un graphique existe déjà, le détruire avant d'en créer un nouveau
  if (window.stockChartInstance) {
    window.stockChartInstance.destroy();
  }

  window.stockChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Prix des actions (USD)',
        data: prices,
        backgroundColor: prices.map(price => price > 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
        borderColor: prices.map(price => price > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
