// Make an AJAX request to fetch the tokens length
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log('Response from server:', response); // Log the response
            document.getElementById('availableTokens').textContent = `${response.rowCount}`;
        } else {
            console.error('Error fetching tokens:', xhr.status);
        }
    }
};
xhr.open('GET', 'http://localhost:3000', true);
xhr.send();

function redeemToken(){
    const availableTokensInput = document.getElementById("availableTokens");
    
    const availableTokensValue = parseInt(availableTokensInput.textContent);
    if (availableTokensValue<=0){
        alert("You don't have a token to redeem :(");
    }
    else {
        availableTokensInput.innerHTML = availableTokensValue -1;

        // Update the backend to reflect the decrease in token count
        fetch('http://localhost:3000/redeem-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'redeem' })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update token count in the database');
            }
            return response.json();
        })
        .then(data => {
            console.log('Token count updated in the database:', data);
        })
        .catch(error => {
            console.error('Error updating token count in the database:', error);
        });
    }
}