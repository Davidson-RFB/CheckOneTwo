function postData(url = ``, data = {}) {
  return fetch('v1/'+url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${window.localStorage.token}`,
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 401) {
        window.location = '/login';
      }
      return response
    })
    .then(response => response.json())
}

export {
  postData
};
