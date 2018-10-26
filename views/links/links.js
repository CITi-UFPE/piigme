
const populateTable = (links) => {
    document.querySelector('#table-links').innerHTML = `
      <tr>
        <th>Custom Links</th>
        <th>Original Links</th>
        <th>Views</th>
      </tr>
    `;
  
    links.forEach((each) => {
      document.querySelector('#table-links').innerHTML += `
        <tr>
          <td><a href="/${each.key}">/${each.key}</a></td>
          <td>${each.original_link}</td>
          <td id="table-clicks">${each.clicks}</td>
        </tr>
      `;
    });
  };
  
const httpGet = (success) => {
      const http = new XMLHttpRequest();
      const url = `api/get_links`;
  
      http.open('GET', url, true);
  
      http.onreadystatechange = () => {
          if(http.readyState === 4 && http.status === 200){
              success(http.response);
          }
      }
  
      http.send();
};

httpGet((res) => {
    const data = JSON.parse(res);
    populateTable(data);
});

document.querySelector('#button-home').addEventListener('click', () => {
    window.location.href = '/';
});