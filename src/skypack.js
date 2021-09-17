import debounce from './utils/debounce.js'
import { $ } from './utils/dom.js'

const API_URL = 'https://api.skypack.dev/v1'
const CDN_URL = 'https://cdn.skypack.dev'

const $skypackSearch = $('#skypack input[type="search"]')
$skypackSearch.addEventListener('input', debounce(handleSearch, 300))

async function handleSearch () {
  const $searchInput = $skypackSearch
  const $searchResults = $('#skypack .search-results')
  const $searchResultsList = $searchResults.querySelector('ul')

  $searchResults.classList.remove('hidden')
  $searchResultsList.innerHTML = ''

  const searchTerm = $searchInput.value.toLowerCase()

  if (searchTerm === '') {
    $searchResults.classList.add('hidden')
    return
  }

  const results = await fetchPackages(searchTerm)

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const $li = document.createElement('li')
    $li.title = result.description

    $li.innerHTML = `
        <strong>${result.name}</strong>
        <small>${result.description}</small>
    `

    $li.addEventListener('click', () => handlePackageSelected(result.name))

    $searchResultsList.appendChild($li)
  }

  $searchResults.classList.remove('hidden')
}

function fetchPackages (packageName) {
  // eslint-disable-next-line no-undef
  return fetch(`${API_URL}/search?q=${packageName}&p=1`)
    .then((response) => response.json())
    .then((data) => {
      return data.results.map((result) => {
        return {
          name: result.name,
          description: result.description
        }
      })
    })
}

function handlePackageSelected (packageName) {
  console.log(`${CDN_URL}/${packageName}`)
}
