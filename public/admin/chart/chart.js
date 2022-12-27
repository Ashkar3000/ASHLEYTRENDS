window.onload=function () {
    //alert("gaddadadad")
    if ($('#payment').length) {
        $.ajax({
            url:"/admin/chartPayment",
            success: (response) => {
                //alert(response.name)
                const data1 = {
                  labels: response.name,
                  datasets: [
                    {
                      label: "labels",
                      data: response.data,
                      backgroundColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)",
                        "rgb(255, 205, 86)",
                      ],
                      hoverOffset: 4,
                    },
                  ],
                };
                const myChart = new Chart(document.getElementById("payment"), {
                  type: "pie",
                  data: data1,
                });
              },
            });
          }
          if ($("#sales").length) {
            $.ajax({
              url: "/admin/sales",
              success: (response) => {
                //alert(response.orderCounts)
                date=new Date().getMonth()
                Month=[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ]
                label=Month.slice(0,date+1)
   
                var ctx = document.getElementById("sales").getContext("2d");
                var chart = new Chart(ctx, {
                  // The type of chart we want to create
                  type: "line",
                  options: {
                    scales: {
                      xAxes: [
                        {
                          type: "time",
                        },
                      ],
                    },
                  },
        
                  // The data for our dataset
                  data: {
                    labels:label,
                    datasets: [
                      {
                        label: "Sales",
                        tension: 0.3,
                        fill: true,
                        backgroundColor: "rgba(44, 120, 220, 0.2)",
                        borderColor: "rgba(44, 120, 220)",
                        data: response.orderCounts,
                      },
                    ],
                  },
                  options: {
                    plugins: {
                      legend: {
                        labels: {
                          usePointStyle: true,
                        },
                      },
                    },
                  },
                });
              },
            });
          }
}            
