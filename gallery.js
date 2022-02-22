let galleryImgs = document.querySelectorAll('.images-container img');
let galleryArray = Array.from(galleryImgs)
let srcArray = galleryArray.map((item)=> item.src)
console.log(srcArray)

console.log(galleryArray)

let prvwContainer = document.getElementById('preview-container')
let prvwImg = document.getElementById('preview-image');

let cancel = document.getElementById('cancel')

let btnLeft= document.querySelector('.btn-left')
console.log(btnLeft)

let btnRight= document.querySelector('.btn-right')

for(img of galleryImgs){
    img.addEventListener('click', (e)=>{
        // console.log(e.target)
        // console.log(galleryArray.indexOf(e.target))
        prvwImg.src = e.target.src;
        prvwContainer.style.display = 'block'
        document.body.style.overflow = 'hidden'
    })
}


btnLeft.addEventListener('click', ()=>{
    console.log(srcArray.indexOf(prvwImg.src))
    prvwImg.classList.add('fade')
    let currentImgIndex = srcArray.indexOf(prvwImg.src)
    currentImgIndex--
    if(currentImgIndex < 0){
        currentImgIndex = srcArray.length-1
    }
    prvwImg.src = srcArray[currentImgIndex]
    setTimeout(()=>prvwImg.classList.remove('fade'),2000)
});


btnRight.addEventListener('click', ()=>{
    console.log(srcArray.indexOf(prvwImg.src))
    prvwImg.classList.add('fade')
    let currentImgIndex = srcArray.indexOf(prvwImg.src)
    currentImgIndex++
    if(currentImgIndex >= srcArray.length){
        currentImgIndex = 0
    }
    prvwImg.src = srcArray[currentImgIndex]
    setTimeout(()=>prvwImg.classList.remove('fade'),2000)
});


cancel.addEventListener('click', ()=> {
    prvwContainer.style.display = 'none';
    document.body.style.overflow = 'visible'
});


//----------Hooking up hamburger menu-----------------

const hamBtn = document.getElementById('menu-btn')

const mobileNav = document.getElementById('menu')

hamBtn.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('open');
    mobileNav.classList.toggle('hidden')
})