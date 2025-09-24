 // Mapeamento de imagens/nome
        const currencyInfo = {
            BRL: { name: "Real Brasileiro", img: "./assets/real-pin.png" },
            USD: { name: "Dólar Americano", img: "./assets/dolar-pin.png" },
            EUR: { name: "Euro", img: "./assets/euro-pin.png" },
            GBP: { name: "Libra Esterlina", img: "./assets/libra-pin.png" },
            BTC: { name: "Bitcoin", img: "./assets/bitcoin-pin.png" }
        };

        function updateCurrencyBox(type, currencyCode) {
            const info = currencyInfo[currencyCode];
            if (!info) {
                console.warn("updateCurrencyBox: moeda não encontrada", currencyCode);
                return;
            }
            console.log(`updateCurrencyBox -> type=${type}, currency=${currencyCode}`, info);
            document.querySelector(`.currency-${type}`).textContent = info.name;
            document.querySelector(`.${type}-img`).src = info.img;
        }

        function formatCurrency(value, currency) {
            if (currency === "BTC") {
                return Number(value).toFixed(8) + " BTC";
            }
            // Proteção: se value for NaN ou indefinido, retorna placeholder
            if (typeof value !== "number" || !isFinite(value)) {
                return "-";
            }
            try {
                return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
            } catch (err) {
                console.warn("formatCurrency: Intl falhou para", currency, err);
                return value;
            }
        }

        // Pega preço do BTC em USD (Binance)
        async function getBTCPriceUSD() {
            console.log("getBTCPriceUSD: buscando preço BTCUSD na Binance...");
            const url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
            const res = await fetch(url);
            console.log("getBTCPriceUSD: status", res.status);
            const json = await res.json();
            console.log("getBTCPriceUSD: json", json);
            const p = parseFloat(json.price);
            console.log("getBTCPriceUSD: price parsed =", p);
            if (!isFinite(p)) throw new Error("Preço BTC inválido");
            return p;
        }

        // Função principal de conversão com logs em cada passo
        async function convertCurrency(amount, from, to) {
            console.log("convertCurrency: start", { amount, from, to });

            let result;

            try {
                // Caso 1: Fiat -> Fiat (BRL, USD, EUR, GBP)
                if (from !== "BTC" && to !== "BTC") {
                    console.log("convertCurrency: caso Fiat->Fiat, consultando Frankfurter...");
                    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
                    console.log("convertCurrency: Frankfurter URL:", url);
                    const res = await fetch(url);
                    console.log("convertCurrency: Frankfurter status", res.status);
                    const data = await res.json();
                    console.log("convertCurrency: Frankfurter data", data);
                    if (!data || !data.rates || data.rates[to] === undefined) {
                        throw new Error("Resposta Frankfurter inválida para Fiat->Fiat");
                    }
                    // data.rates[to] já é o valor convertido (porque usamos amount=)
                    result = Number(data.rates[to]);
                    console.log("convertCurrency: resultado Fiat->Fiat =", result);
                }

                // Caso 2: Fiat -> BTC
                else if (from !== "BTC" && to === "BTC") {
                    console.log("convertCurrency: caso Fiat->BTC");
                    let amountUSD;
                    if (from === "USD") {
                        amountUSD = Number(amount);
                        console.log("convertCurrency: from é USD, amountUSD =", amountUSD);
                    } else {
                        console.log("convertCurrency: convertendo", from, "para USD via Frankfurter...");
                        const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=USD`;
                        console.log("convertCurrency: Frankfurter URL:", url);
                        const res = await fetch(url);
                        console.log("convertCurrency: Frankfurter status", res.status);
                        const data = await res.json();
                        console.log("convertCurrency: Frankfurter data (to USD)", data);
                        if (!data || !data.rates || data.rates.USD === undefined) {
                            throw new Error("Resposta Frankfurter inválida (Fiat->USD)");
                        }
                        amountUSD = Number(data.rates.USD);
                        console.log("convertCurrency: amountUSD =", amountUSD);
                    }

                    const btcPrice = await getBTCPriceUSD();
                    result = amountUSD / btcPrice;
                    console.log("convertCurrency: resultado Fiat->BTC (BTC amount) =", result);
                }

                // Caso 3: BTC -> Fiat
                else if (from === "BTC" && to !== "BTC") {
                    console.log("convertCurrency: caso BTC->Fiat");
                    const btcPrice = await getBTCPriceUSD();
                    console.log("convertCurrency: btcPrice USD =", btcPrice);
                    const amountUSD = Number(amount) * btcPrice;
                    console.log("convertCurrency: amount em USD (BTC->USD) =", amountUSD);

                    if (to === "USD") {
                        result = amountUSD;
                        console.log("convertCurrency: target é USD, resultado =", result);
                    } else {
                        console.log("convertCurrency: convertendo USD para", to, "via Frankfurter...");
                        const url = `https://api.frankfurter.app/latest?amount=${amountUSD}&from=USD&to=${to}`;
                        console.log("convertCurrency: Frankfurter URL:", url);
                        const res = await fetch(url);
                        console.log("convertCurrency: Frankfurter status", res.status);
                        const data = await res.json();
                        console.log("convertCurrency: Frankfurter data (USD->target)", data);
                        if (!data || !data.rates || data.rates[to] === undefined) {
                            throw new Error("Resposta Frankfurter inválida (USD->target)");
                        }
                        result = Number(data.rates[to]);
                        console.log("convertCurrency: resultado BTC->Fiat =", result);
                    }
                }

                else {
                    throw new Error("Caso não tratado");
                }

                console.log("convertCurrency: cálculo finalizado, result =", result);

                // Atualiza valores na section
                const valueToEl = document.querySelector(".value-to-convert");
                const valueConvertedEl = document.querySelector(".value-converted");

                console.log("convertCurrency: formatando valores para exibição...");
                const formattedFrom = formatCurrency(Number(amount), from);
                const formattedTo = formatCurrency(Number(result), to);

                console.log("convertCurrency: formattedFrom =", formattedFrom);
                console.log("convertCurrency: formattedTo  =", formattedTo);

                valueToEl.textContent = formattedFrom;
                valueConvertedEl.textContent = formattedTo;

                console.log("convertCurrency: DOM atualizado (.value-to-convert e .value-converted).");

                return result;

            } catch (err) {
                console.error("convertCurrency: ERRO em processamento:", err);
                throw err;
            }
        }

        // Evento do botão com logs
        document.getElementById("convert").addEventListener("click", async () => {
            console.clear();
            console.log("------ Iniciando conversão (evento click) ------");
            const amount = parseFloat(document.getElementById("amount").value);
            const from = document.getElementById("currencyIn").value;
            const to = document.getElementById("currencyOut").value;

            console.log("Evento: valores lidos ->", { amount, from, to });

            // Atualiza nomes e bandeiras imediatamente
            updateCurrencyBox("to-convert", from);
            updateCurrencyBox("converted", to);

            try {
                const r = await convertCurrency(amount, from, to);
                console.log("Evento: conversão finalizada com sucesso, result =", r);
                document.getElementById("result").textContent = "Conversão efetuada com sucesso.";
            } catch (err) {
                console.error("Evento: erro ao converter:", err);
                document.getElementById("result").textContent = "Erro na conversão: " + (err.message || err);
            }
        });

        // Troca de bandeiras ao alterar selects (opcional, imediato)
        document.getElementById("currencyIn").addEventListener("change", (e) => {
            console.log("currencyIn changed to", e.target.value);
            updateCurrencyBox("to-convert", e.target.value);
        });
        document.getElementById("currencyOut").addEventListener("change", (e) => {
            console.log("currencyOut changed to", e.target.value);
            updateCurrencyBox("converted", e.target.value);
        });

        // Inicializa as caixas com valores iniciais
        updateCurrencyBox("to-convert", document.getElementById("currencyIn").value);
        updateCurrencyBox("converted", document.getElementById("currencyOut").value);
    