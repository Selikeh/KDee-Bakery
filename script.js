// console.log('hi')
imgPath = [
    'images/pizza.jpg',
    'images/drinking-yogurt.jpg',
    'images/yoghurt.jpg'
];

let img = document.getElementById("slider-image");


let i = 0 


// console.log(img.src)
let imgTimer = setInterval(()=>{
    img.classList.remove('fade')
    img.classList.add('fade')
    i++;
    if(i>=imgPath.length){
        i = 0;
    }
    img.src = imgPath[i];
    setTimeout(()=>img.classList.remove('fade'),2000)
        
},4000)

let btnRight = document.getElementsByClassName('btn-right')

let btnLeft = document.getElementsByClassName('btn-left')


console.log(btnRight[0])
btnRight[0].addEventListener('click', () => {
    
    img.classList.add('fade')
    i++
    if(i>=imgPath.length){
        i = 0;
    }
    img.src = imgPath[i];

    setTimeout(()=>img.classList.remove('fade'),2000)

    clearInterval(imgTimer);
    imgTimer = setInterval(()=>{
        img.classList.remove('fade')
        img.classList.add('fade')
        i++;
        if(i>=imgPath.length){
            i = 0;
        }
        img.src = imgPath[i];
        setTimeout(()=>img.classList.remove('fade'),2000)
            
    },4000)

}

)

btnLeft[0].addEventListener('click', () => {
    img.classList.add('fade')
    i--
    if(i<0){
        i = imgPath.length-1;
    }
    img.src = imgPath[i];

    setTimeout(()=>img.classList.remove('fade'),2000)


    clearInterval(imgTimer);
    imgTimer = setInterval(()=>{
        img.classList.remove('fade')
        img.classList.add('fade')
        i++;
        if(i>=imgPath.length){
            i = 0;
        }
        img.src = imgPath[i];
        setTimeout(()=>img.classList.remove('fade'),2000)
            
    },4000)

}

)


//----------Hooking up hamburger menu-----------------

const hamBtn = document.getElementById('menu-btn')

const mobileNav = document.getElementById('menu')

hamBtn.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('open');
    mobileNav.classList.toggle('hidden')
})

// -------------Dynamic Copyright Date---------------
window.onload = () => {
    let copyDate = document.getElementById('copyright-date')
    copyDate.innerText = new Date().getFullYear()
}