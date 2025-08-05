        document.addEventListener('DOMContentLoaded', () => {
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const navLinks = document.querySelectorAll('#mobile-menu a, .navigation-menu a');
            const contatoSection = document.getElementById('contato');
            const popup = document.getElementById('popup-mascote');
            const popupButton = document.getElementById('popup-button');
            const closePopupButton = document.getElementById('close-popup-button');

            // Lógica do menu mobile
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });

            // Oculta o menu mobile após clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                });
            });

            // Lógica do pop-up do mascote
            setTimeout(() => {
                popup.classList.remove('mascot-popup-hidden');
                popup.classList.add('mascot-popup-visible');
            }, 5000); // 5 segundos de delay

            // Observer para o pop-up sumir ao chegar na seção de contato
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        popup.classList.remove('mascot-popup-visible');
                        popup.classList.add('mascot-popup-hidden');
                    }
                });
            }, { threshold: 0.1 }); // Dispara quando 10% da seção está visível

            observer.observe(contatoSection);

            // Adiciona evento de clique no botão do pop-up e no botão 'X'
            popupButton.addEventListener('click', () => {
                popup.classList.remove('mascot-popup-visible');
                popup.classList.add('mascot-popup-hidden');
            });

            closePopupButton.addEventListener('click', () => {
                popup.classList.remove('mascot-popup-visible');
                popup.classList.add('mascot-popup-hidden');
            });


            // --- Lógica da Calculadora de Pegada de Carbono (Powered by Gemini) ---
            const distanceInput = document.getElementById('distance-input');
            const calculateButton = document.getElementById('calculate-button');
            const loadingSpinner = document.getElementById('loading-spinner');
            const resultsContainer = document.getElementById('results-container');
            const co2SolloEl = document.getElementById('co2-sollo');
            const co2CompetitorEl = document.getElementById('co2-competitor');
            const co2SavedEl = document.getElementById('co2-saved');
            const geminiMessageEl = document.getElementById('gemini-message');

            calculateButton.addEventListener('click', async () => {
                const distance = parseFloat(distanceInput.value);

                // Validação simples
                if (isNaN(distance) || distance <= 0) {
                    alert('Por favor, insira uma distância válida.');
                    return;
                }

                // Esconde resultados antigos e mostra o spinner
                resultsContainer.style.display = 'none';
                loadingSpinner.style.display = 'flex';

                try {
                    // Lógica para determinar o tipo de veículo com base na distância
                    let emissionSollo, emissionCompetitor, vehicleType;
                    if (distance <= 200) {
                        // Caminhão Elétrico
                        emissionSollo = 100;
                        emissionCompetitor = 1200;
                        vehicleType = 'caminhão elétrico';
                    } else {
                        // Carreta Híbrida
                        emissionSollo = 550;
                        emissionCompetitor = 950;
                        vehicleType = 'carreta híbrida';
                    }

                    const co2Sollo = (emissionSollo * distance) / 1000; // em kg
                    const co2Competitor = (emissionCompetitor * distance) / 1000; // em kg
                    const co2Saved = co2Competitor - co2Sollo;

                    // Formata os números para exibição
                    const co2SolloFormatted = co2Sollo.toFixed(2);
                    const co2CompetitorFormatted = co2Competitor.toFixed(2);
                    const co2SavedFormatted = co2Saved.toFixed(2);

                    // Atualiza o DOM com os resultados
                    co2SolloEl.innerHTML = `Sollo DF (${vehicleType}): <span style="color: var(--primary-orange);">${co2SolloFormatted} kg de CO2</span>`;
                    co2CompetitorEl.innerHTML = `Concorrente (Diesel): <span style="color: var(--accent-light-blue);">${co2CompetitorFormatted} kg de CO2</span>`;
                    co2SavedEl.innerHTML = `Com a Sollo DF, você reduz: <span style="color: var(--primary-orange); font-weight: 800;">${co2SavedFormatted} kg de CO2</span>`;

                    // --- Chamada à API do Gemini para gerar a mensagem ---
                    // Prompt para a API
                    const prompt = `Gere uma mensagem curta e inspiradora para um cliente que acabou de calcular uma economia de ${co2SavedFormatted} kg de CO2 em uma distância de ${distance} km usando a logística sustentável da Sollo DF. A mensagem deve ser amigável e destacar o impacto positivo da escolha do cliente no meio ambiente. Inclua uma call-to-action para "começar sua jornada sustentável conosco".`;
                    
                    const chatHistory = [];
                    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                    const payload = { contents: chatHistory };
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    
                    const result = await response.json();
                    let geminiText = '';
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        geminiText = result.candidates[0].content.parts[0].text;
                    } else {
                        geminiText = "Obrigado por se preocupar com o meio ambiente! Junte-se a nós para um futuro mais verde.";
                    }
                    
                    geminiMessageEl.innerHTML = geminiText;
                    
                    // Mostra os resultados e esconde o spinner
                    loadingSpinner.style.display = 'none';
                    resultsContainer.style.display = 'block';

                } catch (error) {
                    console.error('Erro ao calcular a pegada de carbono:', error);
                    loadingSpinner.style.display = 'none';
                    alert('Ocorreu um erro ao calcular. Por favor, tente novamente.');
                }
            });

            // --- Lógica para criar os gráficos de CO2 ---
            // Gráfico 1: Caminhões Intermunicipais
            const ctx1 = document.getElementById('co2-chart-intermunicipal').getContext('2d');
            const co2Chart1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Sollo DF (Elétrico)', 'Concorrente (Diesel)'],
                    datasets: [{
                        label: 'Emissão de CO2 (g/km)',
                        data: [100, 1200],
                        backgroundColor: [
                            '#ff8400', 
                            '#8fa0d8' 
                        ],
                        borderColor: [
                            '#0b0829',
                            '#0b0829'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Emissão (g CO2/km)',
                                color: '#1e293b'
                            },
                            ticks: {
                                color: '#1e293b'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#1e293b'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: false,
                        }
                    }
                }
            });

            // Gráfico 2: Carretas Interestaduais
            const ctx2 = document.getElementById('co2-chart-interestadual').getContext('2d');
            const co2Chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Sollo DF (Híbrida)', 'Concorrente (Diesel)'],
                    datasets: [{
                        label: 'Emissão de CO2 (g/km)',
                        data: [550, 950],
                        backgroundColor: [
                            '#ff8400', 
                            '#8fa0d8' 
                        ],
                        borderColor: [
                            '#0b0829',
                            '#0b0829'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Emissão (g CO2/km)',
                                color: '#1e293b'
                            },
                            ticks: {
                                color: '#1e293b'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#1e293b'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: false,
                        }
                    }
                }
            });
        });