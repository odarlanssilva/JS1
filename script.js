console.log("JS carregado")
const convertButton = document.querySelector('.convert-button')
const currencyStandard = document.querySelector('.currency-standard')
const currencySelect = document.querySelector('.currency-select')




function convertCurrency() {
    const inputValue = document.querySelector('.input-value').value
    const valueToConvert = document.querySelector('.value-to-convert') // Valor a ser convertido
    const valueConverted = document.querySelector('.value-converted') // Valor convertido

    
    const euroValue = 6.26
    const libraValue = 7.24
    const bitcoinValue = 612148.13
    const dollarValue = 5.32
    const realValue = 1


    if (currencySelect.value == "euro") {
        valueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(inputValue / euroValue)
    }
    if (currencySelect.value == "libra") {
        valueConverted.innerHTML = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }).format(inputValue / libraValue)
    }
    if (currencySelect.value == "bitcoin") {
        valueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BTC",
            minimumFractionDigits: 8,
            maximumFractionDigits: 8

        }).format(inputValue / bitcoinValue)
    }
    if (currencySelect.value == "dolar") {
        valueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(inputValue / dollarValue)
    }

    if (currencySelect.value == "real") {
        valueConverted.innerHTML = new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL"
        }).format(inputValue / realValue)
    }
    valueToConvert.innerHTML = new Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL"
    }).format(inputValue)

}

function changeCurrency() {

    console.log("trocou de moeda")
    const currencyConverted = document.querySelector('.currency-converted')
    const convertedImg = document.querySelector('.converted-img')

    if (currencySelect.value == "euro") {
        currencyConverted.innerHTML = "Euro"
        convertedImg.src = "./assets/euro-pin.png"
    }
    if (currencySelect.value == "libra") {
        currencyConverted.innerHTML = "Libra Esterlina"
        convertedImg.src = "./assets/libra-pin.png"
    }
    if (currencySelect.value == "bitcoin") {
        currencyConverted.innerHTML = "Bitcoin"
        convertedImg.src = "./assets/bitcoin-pin.png"
    }
    if (currencySelect.value == "dolar") {
        currencyConverted.innerHTML = "Dólar Americano"
        convertedImg.src = "./assets/dolar-pin.png"
    }
     if (currencySelect.value == "real") {
        currencyConverted.innerHTML = "Real Brasileiro"
        convertedImg.src = "./assets/real-pin.png"
     }
    convertCurrency()
}

function changeCurrencyStandard() {

    console.log("trocou de moeda padrão")
    const currencyToConvert = document.querySelector('.currency-to-convert')
    const toConvertImg = document.querySelector('.to-convert-img')
    
    if (currencyStandard.value == "euro") {
        currencyToConvert.innerHTML = "Euro"
        toConvertImg.src = "./assets/euro-pin.png"
    }
    if (currencyStandard.value == "libra") {
        currencyToConvert.innerHTML = "Libra Esterlina"
        toConvertImg.src = "./assets/libra-pin.png"
    }
    if (currencyStandard.value == "bitcoin") {
        currencyToConvert.innerHTML = "Bitcoin"
        toConvertImg.src = "./assets/bitcoin-pin.png"
    }
    if (currencyStandard.value == "dolar") {
        currencyToConvert.innerHTML = "Dólar Americano"
        toConvertImg.src = "./assets/dolar-pin.png"
    }
        if (currencyStandard.value == "real") {
        currencyToConvert.innerHTML = "Real Brasileiro"
        toConvertImg.src = "./assets/real-pin.png"
    }
    convertToReal()
}

function convertToReal() {

    console.log("convertendo para real")
    const inputValue = document.querySelector('.input-value').value
    const valueToConvert = document.querySelector('.value-to-convert') // Valor a ser convertido
    const valueConverted = document.querySelector('.value-converted') // Valor convertido 
    const euroValue = 6.26
    const libraValue = 7.24
    const bitcoinValue = 612148.13
    const dollarValue = 5.32
    const realValue = 1
    let valueInReal = 0
    if (currencyStandard.value == "euro") {
        valueInReal = (inputValue * euroValue)
    }
    if (currencyStandard.value == "libra") {
         valueInReal = (inputValue * libraValue)
    }
    if (currencyStandard.value == "bitcoin") {
         valueInReal = (inputValue * bitcoinValue)
    }
    if (currencyStandard.value == "dolar") {
         valueInReal = (inputValue * dollarValue)
        console.log(valueInReal)
    }
    if (currencyStandard.value == "real") {
         valueInReal = (inputValue * realValue)
    }
    document.querySelector('.input-value').value = valueInReal.toFixed(2)

    convertCurrency()
}

convertButton.addEventListener("click", convertCurrency)
currencySelect.addEventListener("change", changeCurrency)
currencyStandard.addEventListener("change", changeCurrencyStandard)