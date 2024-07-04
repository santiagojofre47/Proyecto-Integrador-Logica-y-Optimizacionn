const tableContainer = document.getElementById('tableContainer');

document.addEventListener('DOMContentLoaded', () => {
    let button = document.getElementById("resultButton");
    button.onclick = () => getResult('/getObject?bucketName=jugos-donotdelete-pr-k9dowohhrgnqxt&itemName=solucion.csv');
});

async function getResult() {
    try {
        document.getElementById("feedback").innerHTML = "Procesando..."
        const response = await fetch("/resolverProblema", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const responseData = await response.json();
        document.getElementById("feedback").innerHTML = ""
        if (responseData === 'Solucion imposible'){
            document.getElementById("feedback").innerHTML = responseData
        }
        else{
            const table = createTableFromString(responseData)
            tableContainer.appendChild(table);
        }
    } catch (error) {
        document.getElementById("feedback").innerHTML = 'Hubo un problema con la solicitud Fetch:' + error
    }
}

function createTableFromString(data) {
    const rows = data.trim().split('\n');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Crear encabezado
    const headers = rows[0].replace(/"/g, '').split(',');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    
    for (let i = 1; i < rows.length; i++) {
        const row = document.createElement('tr');
        const cells = rows[i].replace(/"/g, '').split(',');
        cells.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}



