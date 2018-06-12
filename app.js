$('#getWeatherBtn').click(() => {
    $('#chart-container').hide();
    console.log("Button clicked");
    const city=$('#cityname').val();
    $.ajax({
        type:'GET',
        url:`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=27d43832d2a4adcb97fcbfa23db130aa`,
        success : (data) => 
        {
            const currentTemp=(data.main.temp-270);
            const currentPress=data.main.pressure;
            const currHumidity=data.main.humidity;
            $('#currentTemperature').html(currentTemp);
            $('#currentHumidity').html(currHumidity);
            $('#currentPressure').html(currentPress);
            $('table').show();
        },
        error : (err) =>
        {
           console.log('In error callback');
            console.log(err);
        }
    });

})

$('#getForecastBtn').click(() => {
    $('table').hide();
    const cityName = $('#cityname').val();
    
    $.ajax({
        type: 'GET',
        url: `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=27d43832d2a4adcb97fcbfa23db130aa`,
        success: (data) => {
            console.log('In success callback');
            console.log(data);

            listOfDates = data.list.map((ele) => moment(ele.dt * 1000).format('dddd, h:mm a'));
            console.log(listOfDates);
            listOfTemp = data.list.map(ele => Math.round(ele.main.temp - 270));
            console.log(listOfTemp);
            plotChart(listOfTemp, listOfDates);
        },
        error: (err) => {
            console.log('In error callback');
            console.log(err);
        }
    });

    const plotChart = (tempArr, datesArr) => {
        $('#chart-container').show();
        Highcharts.chart('chart-container', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Monthly Average Temperature'
            },
            xAxis: {
                categories: datesArr
            },
            yAxis: {
                title: {
                    text: 'Temperature'
                },
                labels: {
                    formatter: function () { return this.value + '°'; }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            series: [{
                name: cityName,
                marker: {
                    symbol: 'square'
                },
                data: tempArr

            }]
        });
    }

})