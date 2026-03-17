const url = '1Kp9k3AjDe0-fCRFt00jNTESnebvNnb-uby8d_nUuktQBVNZxndgYoctp';

// Получаем список рабочих
async function getWorkers() {
    let response = await fetch(url);
    let data = await response.json();
    
    // Рисуем список на странице
    data.forEach((worker, index) => {
        document.body.innerHTML += `
            <div>
                ${worker[0]} (${worker[1]}) 
                <button onclick="deleteWorker(${index + 1})">Удалить</button>
            </div>`;
    });
}