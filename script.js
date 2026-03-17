 // ВСТАВЬ СВОЮ ССЫЛКУ НИЖЕ
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbzH43J3zQOPJQo4bJL4PTtC7SpWMWgFKOLpeCSKD-mqsVTQJXQEGGHtTGCF6VhGd3KFRQ/exec';

        // 1. Загрузка данных из таблицы
        async function loadData() {
            showLoader(true);
            try {
                const response = await fetch(scriptUrl);
                const data = await response.json();
                renderTeams(data);
            } catch (e) { alert("Ошибка загрузки данных"); }
            showLoader(false);
        }

        // 2. Группировка по бригадам и отрисовка
        function renderTeams(workers) {
            const container = document.getElementById('mainContent');
            container.innerHTML = '';
            
            const teams = [...new Set(workers.map(w => w.team))]; // Получаем список уникальных бригад

            teams.forEach(teamName => {
                const teamDiv = document.createElement('div');
                teamDiv.innerHTML = `<div class="team-title" onclick="toggleTeam('${teamName}')">${teamName} ▼</div>`;
                
                const workersList = document.createElement('div');
                workersList.id = teamName;
                workersList.className = 'hidden card';

                workers.filter(w => w.team === teamName).forEach(w => {
                    workersList.innerHTML += `
                        <div class="worker-item">
                            <span>${w.name}</span>
                            <button class="btn btn-del" onclick="deleteWorker(${w.id})">Удалить</button>
                        </div>`;
                });
                
                container.appendChild(teamDiv);
                container.appendChild(workersList);
            });
        }

        // 3. Добавление рабочего
        async function addWorker() {
            const name = document.getElementById('workerName').value;
            const team = document.getElementById('teamSelect').value;
            if (!name) return alert("Введите имя");

            showLoader(true);
            await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'add', name, team })
            });
            document.getElementById('workerName').value = '';
            loadData();
        }

        // 4. Удаление рабочего
        async function deleteWorker(id) {
            if (!confirm("Удалить рабочего?")) return;
            showLoader(true);
            await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'delete', id })
            });
            loadData();
        }

        // Вспомогательные функции
        function toggleTeam(id) {
            const el = document.getElementById(id);
            el.classList.toggle('hidden');
        }

        function showLoader(show) {
            document.getElementById('loader').classList.toggle('hidden', !show);
        }

        // Запуск при открытии
        loadData();