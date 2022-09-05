import {MAPBOX_API_KEY, API_SPREADSHEET_URL, JSON_STORAGE_API_KEY} from './apikey.js'

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}

function ready(){
    let orderIDs = [2133241241234]
    let removeItemsBtn = document.getElementsByClassName('remove-btn')
    const modalBlock = document.getElementById('checkout-modal-block')
    const modalSection = document.getElementById('checkout-modal')
    // let relaodPageBtn = document.getElementById('reload-page-button')
    
    // relaodPageBtn.addEventListener('click', reloadPage)
        
    // relaodPageBtn.innerText ="Ok"
    for(let btn of removeItemsBtn){
        btn.addEventListener('click', removeCartItem) //remove item from cart when the remove button is clicked
    }

    let itemQtyInputs = document.getElementsByClassName('item-number-input')

    for(let input of itemQtyInputs){
        input.addEventListener('change', (event)=>{
            if(event.target.value == NaN || event.target.value <= 0){
                event.target.value = 1
            }

            updateCartTotal()
        })
    }
    
    let cart = document.getElementById('cart')

    const addToCartBtn = document.getElementsByClassName('add-to-cart-btn')
    for(let btn of addToCartBtn){
        btn.addEventListener('click', (event)=>{
            const productImg = event.target.parentElement.parentElement.getElementsByClassName('product-img')[0].src
            // console.log(productImg)
            const productPrice = event.target.parentElement.getElementsByClassName('product-price')[0].innerText.replace('$', '')
            // console.log(productPrice)
            const productName = event.target.parentElement.getElementsByClassName('product-name')[0].innerText
            // console.log(productName)
            
            // ------------------------------------------------
            let itemList= []
            let itemNames = cart.getElementsByClassName('item-name')
            for( let item of itemNames){
                itemList.push(item.innerText)
            }
            // console.log(itemList)
                if(itemList.includes(productName)){
                    alert('Item already in cart')
                } else{
                    let newEntry = document.createElement('div')
        
                    newEntry.classList.add("cart-row")
                    let cartContent =`<div class="item-block item-description">
                                            <img src=${productImg} alt="">
                                            <span class="item-name">${productName}</span>
                                        </div>
                                        <div class="item-price">
                                            $${productPrice}
                                        </div>
                                        <div class="item-block item-qty">
                                            <input class="item-number-input" type="number" value="1" min="1">
                                            <button class="remove-btn">Remove</button>
                                        </div>`
        
                    newEntry.innerHTML = cartContent
        
                    // console.log(newEntry)
                    
                    cart.appendChild(newEntry)
                    // console.log(newEntry.getElementsByClassName('item-block')[1].getElementsByClassName('remove-btn')[0])
                    
                    newEntry.getElementsByClassName('item-block')[1].getElementsByClassName('remove-btn')[0].addEventListener('click', removeCartItem)
                    newEntry.getElementsByClassName('item-block')[1].getElementsByClassName('item-number-input')[0].addEventListener('change', updateCartTotal)
                    updateCartTotal()
                }

            
        })


    }
    
    function removeCartItem(event){
        // console.log(event.target.parentElement)
        event.target.parentElement.parentElement.remove()
        
        updateCartTotal()
    }

    function updateCartTotal(){
        let total = 0
        let cartTotal = document.getElementsByClassName('cart-total')[0]
        const cartRow = cart.getElementsByClassName('cart-row')
        for(let i=1; i<cartRow.length; i++){
           let price = parseFloat(cartRow[i].getElementsByClassName('item-price')[0].innerText.replace('$', "")).toFixed(2)
            // console.log(price)
            let qty = cartRow[i].getElementsByClassName('item-qty')[0].getElementsByClassName('item-number-input')[0].value
            // console.log(qty)
            total += (price*qty)
        }

        cartTotal.innerText = "$"+total.toFixed(2)
    }


    const purchaseBtn = document.getElementById('purchase-btn')

    purchaseBtn.addEventListener('click', checkout)
    
    let deliveryLocation = "-"
    let purchaseIdModalBlock = document.getElementById('purchaseId-modal-block')
    
    function logPurchase(event){
            let orderID
            const customerName = document.getElementById('customer-name').value
            const customerPhone = document.getElementById('customer-phone').value
            const customerMail = document.getElementById('customer-mail').value
            if(customerMail == undefined){
                customerMail = "-"
            }
            let orderType
            if(document.getElementById('radio-delivery').checked){
                orderType = "delivery"
            }else{
                orderType = 'pickup'
            }
            let itemArr = []
            let itemLog = []
            let cartItems = cart.getElementsByClassName('item-name')
            if(customerName !=='' && customerPhone !== ''){
                event.target.innerHTML = `<div class="loader"></div>`
            }

            // =======get the latest orderID, update it and store=========
            $.ajax({
                url:"https://api.jsonstorage.net/v1/json/3f84a7ad-dd1f-4d1e-b75e-e8c6f2aad308/716becf7-7a55-49f2-a0ea-dd81d80f3775",
                type:"get",
                success: function(response){
                    // console.log(response)
                    // idArr = response[response.length-1]
                    let newID = parseInt(response.id) + 1
                    let newObj = {"id": `${newID}`}
                    orderID = newObj.id
                    // console.log('order id is: ' + orderID)
                    let data = JSON.stringify(newObj)
                    // console.log(data)
                    $.ajax({
                        url:`https://api.jsonstorage.net/v1/json/3f84a7ad-dd1f-4d1e-b75e-e8c6f2aad308/716becf7-7a55-49f2-a0ea-dd81d80f3775?apiKey=${JSON_STORAGE_API_KEY}`,
                        type:"put",
                        contentType: 'application/json',
                        dataType: "json",
                        data: data,
                        success: function(response){
                            // console.log('response is: ' + response)
                            // console.log('success')
                            let logItems = ""
                            let logTotalPrice = 0
                            for ( let item of cartItems){
                                // let purchaseItemName = item.innerText
                                let purchaseItemNumber = item.parentElement.parentElement.getElementsByClassName("item-number-input")[0].value
                                
                                logItems += item.innerText + ' ' + item.parentElement.parentElement.getElementsByClassName("item-number-input")[0].value + 'x '
                                
                                let purchaseItemPrice = item.parentElement.parentElement.getElementsByClassName("item-price")[0].innerText.replace('$', '')
                                logTotalPrice += (parseFloat(purchaseItemNumber) * parseFloat(purchaseItemPrice))
                                
                            }
                                // console.log(logItems)
                                // console.log(logTotalPrice.toString())
                            
                                // let purchaseTotalPrice = (parseFloat(purchaseItemNumber) * parseFloat(purchaseItemPrice)).toString()
                                
                                

                                // console.log(purchaseItemName, purchaseItemPrice, purchaseItemNumber, purchaseTotalPrice)
                                // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX THIS IS IMPORTANT!!!! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                                itemLog = [
                                    {name:"orderID", value: orderID},
                                    {name:"customerName", value: customerName},
                                    {name:"customerPhone", value: customerPhone},
                                    {name:"customerMail", value: customerMail},
                                    {name:"orderType", value: orderType},
                                    {name:"deliveryLocation", value: deliveryLocation.toString()},
                                    // {name:"logItemName", value: purchaseItemName},
                                    // {name:"logItemPrice", value: purchaseItemPrice},
                                    // {name:"logItemNumber", value: purchaseItemNumber},
                                    // {name:"logItemTotalPrice", value: purchaseTotalPrice},
                                    {name:"logItems", value: logItems},
                                    {name:"deliveryFee", value: deliveryFee.toString()}
                                ]
                                // console.log(itemLog)
                                
                                if(customerName !=='' && customerPhone !== ''){
                                    $.ajax({
                                        url: API_SPREADSHEET_URL,
                                        type:"post",
                                        data:itemLog,
                                        success: function(){
                                            // alert("Purchase Completed :)")
                                            modalBlock.style.display = "none"
                                            let orderInfoContainer = document.getElementById('info-container')
                                            orderInfoContainer.innerHTML = `<h2>Order Successful</h2>
                                                                            <div>Order Number:</div>
                                                                            <h1 id="orderNumber">${orderID}</h1>
                                                                            <div>Kindly make payment to the MTN Mobile Money Number <span>0244 444 444</span> with the Order Number as reference</div>`
                                            purchaseIdModalBlock.style.display = 'block'
                                            orderInfoContainer.scrollIntoView(true)
                                        },
                                        error: function(){
                                            alert("There was an error :(")
                                            orderInfoContainer.innerHTML= `<h2>Order Unsuccessful</h2>
                                            <div>There was an error</div>`
                                        }
                                    });
                                    itemArr.push(itemLog)
                                }
                               
                        },
                        error: function(){
                            alert('error')
                        
                        }
                    })
                   /*  } */
                },
                error: function(){
                    alert('error')
                }
            })

        }
    

    function checkout(){
        modalBlock.style.display = "block"
        let checkoutItems = document.getElementById('checkout-products')
        let cartItems = cart.getElementsByClassName('item-name')
        for (let item of cartItems){
            let purchaseItemName = item.innerText
            let purchaseItemPrice = item.parentElement.parentElement.getElementsByClassName("item-price")[0].innerText.replace('$', '')
            let purchaseItemNumber = item.parentElement.parentElement.getElementsByClassName("item-number-input")[0].value
            let purchaseTotalPrice = (parseFloat(purchaseItemNumber) * parseFloat(purchaseItemPrice)).toFixed(2)
            modalSection.style.height= `${parseFloat(getComputedStyle(modalSection).height.replace('px', '')) + 10}px`

            checkoutItems.innerHTML += ` <div class="order-item-details">
                                        <div>
                                            <div class="order-item-name">${purchaseItemName}</div>
                                        </div>
                                        <div>    
                                            <div class="order-item-qty">${purchaseItemNumber}</div>
                                        </div> 
                                        <div>
                                            <div class="order-item-subtotal">${purchaseTotalPrice}</div>
                                        </div>
                                        </div>`
        }

        document.getElementById('order-item-total').children[1].innerText = document.getElementsByClassName('cart-total')[0].innerText
        // modalSection.style.height = `${parseFloat(getComputedStyle(modalSection).height.replace('px', '')) +12}px`
        // console.log(getComputedStyle(modalSection).height.replace('px', ''))
        checkoutItems.scrollIntoView(false)
    }

        
    // ===================Order Options=====================
    const pickupRadio = document.getElementById('radio-pickup')
    const deliveryRadio = document.getElementById('radio-delivery')
    const map = document.getElementById('map-section')
    pickupRadio.addEventListener('change', hideMap)
    deliveryRadio.addEventListener('change', showMap)

    function hideMap(){
        setTimeout(()=>{map.style.border = 'none'},2000)
        map.style.transition = 'all 2s ease-in-out'
        modalSection.style.transition = 'all 2s ease-in-out'
        map.style.height = '0px'
        modalSection.style.height = `${parseFloat(getComputedStyle(modalSection).height.replace('px', '')) - 300}px`
        document.getElementById('freezoneInfo').style.display = 'none'
    }

    function showMap(){
        map.style.transition = 'all 2s ease-in-out'
        modalSection.style.transition = 'all 2s ease-in-out'
        map.style.height = '225px'
        map.style.border = '1px solid var(--primary)'
        modalSection.style.height = `${parseFloat(getComputedStyle(modalSection).height.replace('px', '')) + 300}px`
        document.getElementById('freezoneInfo').style.display = 'block'
    }

    // ============delivery details=========
    let deliveryFee = 0
    pickupRadio.addEventListener('change',()=>{
        if(pickupRadio.checked == true){
            document.getElementById('checkout-delivery').style.display = 'none'
            deliveryFee = 0
            deliveryLocation = "-"
            document.getElementById('order-item-total').children[1].innerText = '$' + (parseFloat(document.getElementsByClassName('cart-total')[0].innerText.replace('$', '')) + deliveryFee) 
        }
    })
    
    deliveryRadio.addEventListener('change',()=>{
        if(deliveryRadio.checked == true){
            document.getElementById('checkout-delivery').style.display = 'block'
            deliveryMap.resize()
            document.getElementById('order-item-total').children[1].innerText = '$' + (parseFloat(document.getElementsByClassName('cart-total')[0].innerText.replace('$', '')) + deliveryFee) 
        }
    })
    // =================MAP code goes here=======================
    let deliveryDistance
    mapboxgl.accessToken = MAPBOX_API_KEY

    const deliveryMap = new mapboxgl.Map({
        container: 'map-section',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0.8141128, 6.1166589],
        zoom: 15
    });

    // Set marker options.

    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0.8141466731678975, 6.116758880636112]
            },
            properties: {
                title: 'Mapbox',
                description: 'KDee Bakery'
            }
        }]
    }

    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
    
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
            )
        )
        .addTo(deliveryMap);
    }


    const deliveryMarker = new mapboxgl.Marker({
        color: "rgb(126, 17, 17)",
        draggable: true
    }).setLngLat([0.8141466731678975, 6.116758880636112])
        .addTo(deliveryMap);

    deliveryMarker.on('drag', ()=>{
        const lngLat = deliveryMarker.getLngLat()
        deliveryMap.setCenter(lngLat)
        deliveryLocation = lngLat
    })

    let freeDelivery = true

    deliveryMap.on('drag', ()=>{
        let point = deliveryMap.getCenter()
        deliveryMarker.setLngLat(point)
        const lngLat = deliveryMarker.getLngLat()
        deliveryLocation = lngLat
    })

    deliveryMarker.on('dragend',deliveryMapCheck)
    deliveryMap.on('dragend', deliveryMapCheck)


    function deliveryMapCheck(){
        const lngLat = deliveryMarker.getLngLat()
        // ================turf check if marker pt is in polygon========
        var pt = turf.point([lngLat.lng, lngLat.lat]);
        freeDelivery = turf.booleanPointInPolygon(pt, poly)
        // console.log(freeDelivery);
        // =========using jQuery ajax to get the distance b/n store and delivery point from the direction api
        $.ajax({
            url:`https://api.mapbox.com/directions/v5/mapbox/driving/0.8141466731678975,6.116758880636112;${lngLat.lng},${lngLat.lat}?access_token=${mapboxgl.accessToken}`,
            type:"get",
            success: function(result){
                // console.log(result.routes[0].distance)
                deliveryDistance = result.routes[0].distance
                /* if point is outside free delivery zone,
                calculate and add delivery fee to total fee*/
                if(freeDelivery){
                    deliveryFee = 0
                    document.getElementById('order-item-total').children[1].innerText = '$' + (parseFloat(document.getElementsByClassName('cart-total')[0].innerText.replace('$', '')) + deliveryFee)  
                    document.getElementById('checkout-delivery').children[1].innerText = "Free Delivery"
                }else{
                    deliveryFee = Math.round(deliveryDistance/1000) * 5
                    // console.log('delivery distance is: ' + deliveryDistance)
                    // console.log('delivery fee is: ' + deliveryFee)
                    document.getElementById('checkout-delivery').children[1].innerText = '$' + deliveryFee
                    document.getElementById('order-item-total').children[1].innerText = '$' + (parseFloat(document.getElementsByClassName('cart-total')[0].innerText.replace('$', '')) + deliveryFee) 
                }
            },
            error: function(){
                alert("There was a a error :(")
            }
        });
    }

    deliveryMap.on('load', () => {
        // Add a data source containing GeoJSON data.
        deliveryMap.addSource('akatsi', {
        'type': 'geojson',
        'data': {
        'type': 'Feature',
        'geometry': {
        'type': 'Polygon',
        // These coordinates outline Akatsi.
        'coordinates': [
            [
                [0.7801673184143283, 6.148322934459273],
                [0.8454386097205315, 6.152287617835242],
                [0.8576113907359968, 6.087596997239359],
                [0.7841549535734202, 6.071110074065999],
                [0.7499452414090229, 6.102413926922765],
                [0.7801673184143283, 6.148322934459273]
            ]
        ]
        }
        }
        });

        deliveryMap.addLayer({
            'id': 'akatsi',
            'type': 'fill',
            'source': 'akatsi', // reference the data source
            'layout': {},
            'paint': {
            'fill-color': 'rgb(243, 233, 201)', // cream color fill
            'fill-opacity': 0.5
            }
            });
            // Add a brown outline around the polygon.
            deliveryMap.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'akatsi',
            'layout': {},
            'paint': {
            'line-color': 'rgb(126, 17, 17)',
            'line-width': 3
            }
            });
            });


    // ====================Turf.js features go here===========
    var poly = turf.polygon([[
                [0.7801673184143283, 6.148322934459273],
                [0.8454386097205315, 6.152287617835242],
                [0.8576113907359968, 6.087596997239359],
                [0.7841549535734202, 6.071110074065999],
                [0.7499452414090229, 6.102413926922765],
                [0.7801673184143283, 6.148322934459273]
    ]]);

    const placeOrderBtn = document.getElementById('place-order-btn')

    document.getElementById('orderForm').addEventListener('submit', (e)=> e.preventDefault())

    placeOrderBtn.addEventListener('click', logPurchase)

    // -----------------------jump to cart button functionality..............................
    
    const scrollToCartBtn = document.getElementsByClassName('scroll-to-cart-icon-container')[0]
    
    window.addEventListener('scroll', ()=>{
        if(window.scrollY >= 1070){
            scrollToCartBtn.style.display = "none"
        }else{
            scrollToCartBtn.style.display = "block"
        }
    })

    // let cartPstn = document.getElementById('cart-headings').getBoundingClientRect()

    // window.addEventListener('scroll', ()=>{
        
    //     console.log(cartPstn.bottom, window.scrollY)
    //         // if(cartPstn.top <= 0){
    //         //     scrollToCartBtn.style.display = "none"
    //         //     console.log('in vp')
    //         // }else{
    //         //     scrollToCartBtn.style.display = "block"
    //         //     console.log('not in viewport')
    //         // }
    //     })

    //----------Hooking up hamburger menu-----------------

    const hamBtn = document.getElementById('menu-btn')

    const mobileNav = document.getElementById('menu')

    hamBtn.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('open');
        mobileNav.classList.toggle('hidden')
    })

    
}
// -------------Dynamic Copyright Date---------------
window.onload = () => {
    let copyDate = document.getElementById('copyright-date')
    copyDate.innerText = new Date().getFullYear()
}