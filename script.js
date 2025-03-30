const apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=";
const currency = "&vs_currencies=usd";


let hm=new Map();

async function fetchCryptoPrice(crypto) {
    try {
        let response = await fetch(apiUrl + crypto + currency);
        let data = await response.json();
        return data[crypto]?.usd || 0;
    } catch (error) {
        console.error("Error fetching price:", error);
        return 0;
    }
}

async function addCrypto() {
    let cryptoName = document.getElementById("crypto-name").value.toLowerCase();
    let cryptoAmount = parseFloat(document.getElementById("crypto-amount").value);
    if(hm.has(cryptoName))
    {
        hm.set(cryptoName,hm.get(cryptoName)+cryptoAmount);
        updatePortfolioUI();
        return;
    }

    if (!cryptoName || isNaN(cryptoAmount) || cryptoAmount <= 0) {
        alert("Please enter valid cryptocurrency and amount.");
        return;
    }

    let price = await fetchCryptoPrice(cryptoName);

    if (price === 0) {
        alert("Invalid cryptocurrency name.");
        return;
    }

    let totalValue = (cryptoAmount * price).toFixed(2);
    hm.set(cryptoName,cryptoAmount);
    
    updatePortfolioUI();
}

async function updatePortfolioUI() {
    let tableBody = document.getElementById("portfolio-body");
    tableBody.innerHTML = "";

    let rows = await Promise.all([...hm.entries()].map(async ([cryptoName, amount]) => {
        let price = await fetchCryptoPrice(cryptoName);
        return `<tr>
            <td>${cryptoName.toUpperCase()}</td>
            <td>$${price}</td>
            <td>${amount}</td>
            <td>$${(price * amount).toFixed(2)}</td>
        </tr>`;
    }));

    tableBody.innerHTML = rows.join("");
}