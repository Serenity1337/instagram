export const postRequest = (requestBody) => {
  return fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((header) => {
    if (header.ok) {
      return header
    } else {
      console.log(header)
    }
  })
}
