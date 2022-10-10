var chart2;

const getTotal = async (jwt) => {
  try {
    const response = await fetch("http://localhost:3000/api/total", {
      method: "GET",
      headers: {
        "user-agent": "vscode-restclient",
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkxlYW5uZSBHcmFoYW0iLCJ1c2VybmFtZSI6IkJyZXQiLCJpYXQiOjE1OTY1MDY4OTN9.KDSlP9ALDLvyy0Jfz52x8NePUejWOV_mZS6cq4-JZXs"
      },
    });
    const { data } = await response.json();
    let ubicacion = []
    let confirmados = []
    let muertes = []
    let recuperados = []
    let activos = []
    const ctx = document.getElementById('Chart')
    
    data.forEach((element, i) => {
      table(element.location, element.confirmed, element.deaths);
      if (i<10) {
        ubicacion.push(element.location);
        confirmados.push(element.confirmed);
        muertes.push(element.deaths);
        recuperados.push(Math.floor((element.confirmed - element.deaths) * 0.7));
        activos.push(Math.floor((element.confirmed - element.deaths) * 0.3));
      }
    })
    totalCasesChart(ctx, ubicacion, confirmados, muertes, recuperados, activos);

  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

getTotal();

const getCountry = async (paises) => {
  try {
    const response = await fetch(`http://localhost:3000/api/countries/${paises}`, {
      method: "GET",
      headers: {
        "user-agent": "vscode-restclient",
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkxlYW5uZSBHcmFoYW0iLCJ1c2VybmFtZSI6IkJyZXQiLCJpYXQiOjE1OTY1MDY4OTN9.KDSlP9ALDLvyy0Jfz52x8NePUejWOV_mZS6cq4-JZXs"
      }
    })
    const { data } = await response.json();
    /* let chartModal = document.getElementById("chartModal")
    chartModal.innerHTML = ""
    chartModal.innerHTML = '<canvas id="Chart2" width="400" height="400"></canvas>' */
    const ctx2 = document.getElementById('Chart2').getContext("2d");
    let ubicacion = data.location
    let confirmados = data.confirmed
    let muertes = data.deaths
    let recuperados = Math.floor((confirmados - muertes) * 0.7)
    let activos = Math.floor((confirmados - muertes) * 0.3)
    ubicationCasesChart(ctx2, ubicacion, confirmados, muertes, recuperados, activos)
    let tituloPais = document.getElementById("exampleModalLabel");
    tituloPais.innerHTML = paises
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

const totalCasesChart = (ctx, ubicacion, confirmados, muertes, recuperados, activos) => {
  new Chart (ctx, {
    type: 'bar',
    data: {
      labels: ubicacion,
      datasets: [
        {
          label: 'Confirmados',
          data: confirmados,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgb(255, 99, 132)'],
          borderWidth: 1
        },
        {
          label: 'Muertes',
          data: muertes,
          backgroundColor: ['rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgb(255, 159, 64)'],
          borderWidth: 1
        },
        {
          label: 'Recuperados',
          data: recuperados,
          backgroundColor: ['rgba(255, 205, 86, 0.2)'],
          borderColor: ['rgb(255, 205, 86)'],
          borderWidth: 1
        },
        { 
          label: 'Activos',
          data: activos,
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgb(75, 192, 192)'],
          borderWidth: 1
        }
      ]
    }
  })
}

function table(paises, confirmados, muertes){
  let cuerpoTabla = document.getElementById("tbody")
  cuerpoTabla.innerHTML += `
      <tr>
        <td>${paises}</td>
        <td>${confirmados}</td>
        <td>${muertes}</td>
        <td>${Math.floor((confirmados - muertes) * 0.7)}</td>
        <td>${Math.floor((confirmados - muertes) * 0.3)}</td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalMasInfo" onclick="getCountry('${paises}')">
        Más información
      </button></td>
      </tr>
      `
}

function ubicationCasesChart(ctx2, ubicacion, confirmados, muertes, recuperados, activos) {
  if (chart2) {
    chart2.destroy();
  }
  chart2 = new Chart (ctx2, {
    type: 'pie',
    data: {
      labels: [
        'Confirmados',
        'Muertes',
        'Recuperados',
        'Activos'
      ],
      datasets: [{
        label: `${ubicacion}`,
        data: [confirmados, muertes, recuperados, activos],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ],
        hoverOffset: 4
      }]
    }
  })
}

//////////////////////////////////////Situación de Chile con LogIn/////////////////////////////////////////////////

const getData = async (jwt) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        "user-agent": "vscode-restclient",
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${jwt}`,
      },
    };
    const [response1, response2, response3] = await Promise.all(
      [
        fetch("http://localhost:3000/api/confirmed", fetchOptions),
        fetch("http://localhost:3000/api/deaths", fetchOptions),
        fetch("http://localhost:3000/api/recovered", fetchOptions),
      ],
    );
    let  data1 = await response1.json();
    let  data2 = await response2.json();
    let  data3 = await response3.json();
    let ctx3 = document.getElementById("Chart3");
    console.log(data1.data);
    if (data1 && data2 && data3) {
      chileCasesChart(ctx3, data1, data2, data3);
      toggleChartAndChart3('Chart','Chart3');
    }
  } catch (err) {
    localStorage.clear();
    console.error(`Error: ${err}`);
  }
};

const init = async () => {
  const token = localStorage.getItem("jwt-token");
  if (token) {
    getData(token);
  }
};
init();

$("#js-form").submit(async (event) => {
  event.preventDefault();
  console.log('Hola');
  const email = document.getElementById("js-input-email").value;
  const password = document.getElementById("js-input-password").value;
  const JWT = await postData(email, password);
  localStorage.setItem("jwt-token", JWT);
  //esconder todos los botones e interfaz por el loader, cuando aparezca la data esconder el loader
  $('#modalLogIn').modal('hide');
});

$("#situacion-chile").click(async => {
  const JWT = localStorage.getItem("jwt-token");
  getData(JWT);
});

const postData = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    const { token } = await response.json();
    if(token) {
      toggleLogInLogOut('iniciar-sesion', 'situacion-chile', 'cerrar-sesion');
    }
    return token;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

let chileCasesChart = (ctx3, data1, data2, data3) => {
  new Chart(ctx3, {
    type: 'line',
    data: {
      labels: data1.data.map(item => item.date),
      datasets: [
        {
          label: 'Confirmados',
          data: data1.data.map(item => item.total),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Muertes',
          data: data2.data.map(item => item.total),
          fill: false,
          borderColor: 'rgb(255, 159, 64)',
          tension: 0.1
        },
        {
          label: 'Recuperados',
          data: data3.data.map(item => item.total),
          fill: false,
          borderColor: 'rgb(255, 205, 86)',
          tension: 0.1
        }
      ]
    }
  })
}

const toggleChartAndChart3 = (Chart, Chart3) => {
  $(`#${Chart}`).toggle();
  $(`#${Chart3}`).toggle();
};

const toggleLogInLogOut = (LogIn, SituacionChile, LogOut) => {
  $(`#${LogIn}`).toggle();
  $(`#${SituacionChile}`).toggle();
  $(`#${LogOut}`).toggle();
};


document.getElementById("cerrar-sesion").addEventListener("click", function() {
    localStorage.clear();
    toggleLogInLogOut('login', 'logout');
    window.location.reload();
});