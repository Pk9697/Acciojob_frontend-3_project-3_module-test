const table = document.querySelector('table')
const sortByMktCapBtn = document.querySelector('#sort-by-mkt-cap-btn')
const sortByPercentageBtn = document.querySelector('#sort-by-percentage-btn')
const searchInput = document.querySelector('#search')

const coinsData = []
const filteredCoinsData = []

const fetchCoinsData = () => {
	const url =
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'

	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			coinsData.push(...data)
            filteredCoinsData.push(...data)
            renderTable()
		})
}

// fetchCoinsData()

const fetchCoinsDataUsingAsyncAwait = async () => {
    const url =
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    
    const res = await fetch(url)
    const data = await res.json()
    coinsData.push(...data)
    filteredCoinsData.push(...data)
    renderTable()
}

fetchCoinsDataUsingAsyncAwait()

const renderTable = () => {
	table.innerHTML = filteredCoinsData
		.map(
			(coin) =>
				`
            <tr>
                <td>
                    <div class="icon-container">
                        <img
                            src=${coin.image}
                            alt="icon"
                        />
                    </div>
                    ${coin.name}
                </td>
                <td>${coin.symbol.toUpperCase()}</td>
                <td>$${coin.current_price}</td>
                <td>$${coin.total_volume}</td>
                <td class="${
									coin.price_change_percentage_24h < 0
										? 'destructive'
										: 'success'
								}">${coin.price_change_percentage_24h}%</td>
                <td>Mkt Cap: $${coin.market_cap}</td>
            </tr>
        `
		)
		.join(' ')
}


sortByPercentageBtn.addEventListener('click', () => {
	filteredCoinsData.sort(
		(a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
	)
	renderTable()
})

sortByMktCapBtn.addEventListener('click', () => {
	filteredCoinsData.sort((a, b) => b.market_cap - a.market_cap)
	renderTable()
})

searchInput.addEventListener('input', (e) => {
	const searchValue = e.target.value.trim()

	const newFilteredCoinsData = coinsData.filter((coin) => {
		return (
			coin.name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
			coin.symbol.toLowerCase().startsWith(searchValue.toLowerCase())
		)
	})

	filteredCoinsData.length = 0
	if (!searchValue.trim()) {
		filteredCoinsData.push(...coinsData)
	} else {
		filteredCoinsData.push(...newFilteredCoinsData)
	}
	renderTable()
})
