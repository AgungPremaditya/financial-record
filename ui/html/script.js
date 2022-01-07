let dashboard = document.getElementById("dashboard");
let inputkas = document.getElementById("inputkas");

let main_dashboard = document.getElementById("main-dashboard");
let main_input = document.getElementById("main-input");

dashboard.addEventListener('click', function(){
    main_dashboard.style.display ='block';
    main_input.style.display ='none';

    dashboard.style.background = 'white';
    dashboard.style.color = '#b361d6';
    inputkas.style.background = '#b361d6';
    inputkas.style.color = 'white';
})

inputkas.addEventListener('click', function(){
    main_dashboard.style.display ='none';
    main_input.style.display ='block';

    dashboard.style.background = '#b361d6';
    dashboard.style.color = 'white';
    inputkas.style.background = 'white';
    inputkas.style.color = '#b361d6';
})