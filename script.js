 const scriptUrl = 'https://script.google.com/macros/s/AKfycbyuHpcJAL9vMDEGWPIghra0c-hYDE1CcKpgkq5ywFrL6K-eY0elcybv5pKUXaNWtFBkfw/exec';

        // ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ
        window.onload = () => {
            if (localStorage.getItem('isLogged') === 'true') {
                showApp();
            }
        };

        function login() {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            
            if (user === 'islom' && pass === 'islomps') {
                localStorage.setItem('isLogged', 'true');
                showApp();
            } else {
                alert('Неверные данные');
            }
        }

        function logout() {
            localStorage.removeItem('isLogged');
            location.reload();
        }

        function showApp() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            loadData();
        }

        // --- ЛОГИКА ДАННЫХ ---
        let workers = [];

        async function loadData() {
            toggleLoader(true);
            try {
                const res = await fetch(scriptUrl);
                workers = await res.json();
                render();
            } catch (e) { console.error(e); }
            toggleLoader(false);
        }

        function render() {
            const cont = document.getElementById('mainContent');
            cont.innerHTML = '';
            const teams = [...new Set(workers.map(w => w.team))];

            teams.forEach(t => {
                const block = document.createElement('div');
                block.className = 'team-block';
                block.innerHTML = `<div class="team-header" onclick="toggleTeamList(this)">${t} <span>▼</span></div>`;
                
                const list = document.createElement('div');
                list.className = 'hidden';
                workers.filter(w => w.team === t).forEach(w => {
                    const item = document.createElement('div');
                    item.className = 'worker-item';
                    item.innerText = w.name;
                    item.onclick = () => openInfoModal(w);
                    list.appendChild(item);
                });
                block.appendChild(list);
                cont.appendChild(block);
            });
        }

        // --- УПРАВЛЕНИЕ ОКНАМИ ---
        function openAddModal() {
            document.getElementById('addModal').classList.remove('hidden');
            document.getElementById('newDate').valueAsDate = new Date();
        }

        function openInfoModal(w) {
            document.getElementById('infoName').innerText = w.name;
            document.getElementById('infoDate').innerText = w.date || 'Не указана';
            document.getElementById('infoTeam').innerText = w.team;
            document.getElementById('deleteBtn').onclick = () => deleteWorker(w.id);
            document.getElementById('infoModal').classList.remove('hidden');
        }

        function closeModals() {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }

        function toggleTeamList(el) {
            el.nextSibling.classList.toggle('hidden');
        }

        // --- API ДЕЙСТВИЯ ---
        async function saveWorker() {
            const name = document.getElementById('newName').value;
            const team = document.getElementById('newTeam').value;
            const date = document.getElementById('newDate').value;
            if(!name) return alert("Имя?");
            
            closeModals();
            toggleLoader(true);
            await fetch(scriptUrl, { method: 'POST', body: JSON.stringify({action:'add', name, team, date}) });
            loadData();
        }

        async function deleteWorker(id) {
            if(!confirm("Удалить?")) return;
            closeModals();
            toggleLoader(true);
            await fetch(scriptUrl, { method: 'POST', body: JSON.stringify({action:'delete', id}) });
            loadData();
        }

        function toggleLoader(s) { document.getElementById('loader').classList.toggle('hidden', !s); }