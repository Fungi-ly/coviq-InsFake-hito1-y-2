$("#js-form").submit(async (event) => {
  event.preventDefault();
  const email = document.getElementById("js-input-email").value;
  const password = document.getElementById("js-input-password").value;
  const JWT = await postData(email, password);
  getPosts(JWT)
});

const postData = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    const { token } = await response.json();
    localStorage.setItem('jwt-token',token)
    return token;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

const getPosts = async (jwt) => {
  try {
    const response = await fetch("http://localhost:3000/api/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { data } = await response.json();
    if (data) {
        fillTable(data,'js-table-posts')
        toggleFormAndTable('js-form-wrapper','js-table-wrapper')
    }
  } catch (err) {
    localStorage.clear()
    console.error(`Error: ${err}`);
  }
};

const fillTable = (data, table) => {
  let rows = "";
  $.each(data, (i, row) => {
    rows += `<tr>
    <td> ${row.title} </td>
    <td> ${row.body} </td>
    </tr>`;
  });
  $(`#${table} tbody`).append(rows);
};

const toggleFormAndTable = (form, table) => {
  $(`#${form}`).toggle();
  $(`#${table}`).toggle();
};

const init = async () => {
  const token = localStorage.getItem("jwt-token");
  if (token) {
    getPosts(token)
  }
};
init();

