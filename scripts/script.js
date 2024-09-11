const selectLanguage = document.getElementById('language-select')
const stateElement = document.getElementById('state')
const clickToRetry = document.getElementById('retry-button')
const refreshButton = document.getElementById('refresh-button')

clickToRetry.style.display = 'none'
refreshButton.style.display = 'none'
const handleState = (state) => {
	switch (state) {
		case 'empty':
			stateElement.textContent = 'No language selected.'
			break
		case 'loading':
			stateElement.textContent = 'Loading please wait...'
			break
		case 'success':
			stateElement.style.background = 'rgb(228, 225, 225)'
			stateElement.textContent = 'Please select a language'
			break
		case 'error':
			stateElement.textContent = 'Error fetching repositories.'
			stateElement.style.background = 'rgb(255,200,200)'
			break
		default:
			stateElement.textContent = ''
	}
}

const handleSelectLanguage = async () => {
	const language = selectLanguage.value
	if (!language) {
		handleState('empty')
		return
	}
	handleState('loading')

	try {
		refreshButton.style.display = 'none'
		const resp = await fetch(
			`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`
		)
		const data = await resp.json()
		handleState('success')
		const randomIndex = Math.floor(Math.random() * data.items.length)
		const randomRepo = data.items[randomIndex]
		const description = document.createElement('p')
		const name = document.createElement('h3')
		stateElement.textContent = ''
		stateElement.style.flexDirection = 'column'
		stateElement.style.alignItems = 'flex-start'
		description.textContent = randomRepo.description
		description.style.color = 'gray'
		description.style.padding = '10px'
		name.textContent = randomRepo.name
		name.style.padding = '0px 10px'
		stateElement.appendChild(name)
		stateElement.appendChild(description)
		refreshButton.style.display = 'block'
		refreshButton.textContent = 'Refresh'
		refreshButton.addEventListener('click', handleSelectLanguage)
	} catch (error) {
		handleState('error')
		clickToRetry.style.display = 'block'
		clickToRetry.textContent = 'Retry'
		clickToRetry.addEventListener('click', handleSelectLanguage)
	}
}

const resp = async () => {
	try {
		handleState('loading')

		const response = await fetch(
			'https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json'
		)
		const data = await response.json()
		data.forEach((language) => {
			const option = document.createElement('option')
			option.value = language.title
			option.textContent = language.title
			selectLanguage.appendChild(option)
		})

		handleState('success')
	} catch (error) {
		handleState('error')
		console.error('Error fetching languages:', error)
	}
}

selectLanguage.addEventListener('change', handleSelectLanguage)

resp()
