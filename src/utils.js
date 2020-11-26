export const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error('Request was either 404 or 500');
}
  
export const json = (response) => response.json()