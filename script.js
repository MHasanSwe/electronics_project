document.addEventListener("DOMContentLoaded", function() {
    // Placeholder values
    let temperature = 26;  
    let pH = 7.1;          
    let tds = 500;         
    let lightIntensity = 250; 
    let feedingStatus = "Not Feeding"; 

    // Function to fetch data from ESP32
    function fetchData() {
        fetch('http://10.10.251.79/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                let parsedData = JSON.parse(data);
                document.getElementById('tempValue').innerText = `${parsedData.temperature} °C`;
                document.getElementById('phValue').innerText = parsedData.pH;
                document.getElementById('tdsValue').innerText = `${parsedData.tds} ppm`;
                document.getElementById('lightValue').innerText = `${parsedData.lightIntensity} lx`;
                document.getElementById('feeding-status').innerText = parsedData.feedingStatus;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Call fetchData initially
    fetchData();

    // Manual feed button
    document.getElementById('feed-btn').addEventListener('click', function() {
        fetch('http://10.10.251.79/feed', {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('feeding-status').innerText = data;
        })
        .catch(error => {
            console.error('Error feeding:', error);
        });
    });

    // Light intensity control
    document.getElementById('set-light-btn').addEventListener('click', function() {
        let lightValue = document.getElementById('light-slider').value;
        document.getElementById('light-value').innerText = `${lightValue} lx`; // Fixed here
        
        fetch('http://10.10.251.79/set-light', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'value=' + lightValue
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Log response
        })
        .catch(error => {
            console.error('Error setting light:', error);
        });
    });
});
