/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing">

function initMap(): void {
  console.log('hello world')
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 51.945039211681134, lng: -0.27699263419649245 },
      zoom: 17
    }
  );

  const resetButton = document.getElementById("resetMap") as HTMLButtonElement;
  resetButton?.addEventListener('click', function handleResetMapClick(event){        
    initMap();
    const info = document.getElementById('info') as HTMLElement;
    info.innerHTML = '';
  });
  
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        //google.maps.drawing.OverlayType.MARKER,
        //google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        //google.maps.drawing.OverlayType.POLYLINE,
        //google.maps.drawing.OverlayType.RECTANGLE,
      ],
    },
    markerOptions: {
     icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    },
    // circleOptions: {
    //  fillColor: "#ffff00",
    //  fillOpacity: 1,
    //  strokeWeight: 5,
    //  clickable: false,
    //  editable: true,
    //  zIndex: 1,
    // },
  });

  interface Crime {
    category: string
    location_type: string
    location: {
      latitude: string
      street: {
        id: number
        name: string
      }
      longitude: string            
    }
    context: string
    outcome_status: {
      category: string
      date: string
    }
    peristent_id: string
    id: number
    location_subtype: string
    month: string
  }

  google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
    const coords = polygon.getPath().getArray().map(coord => {
      return {
        lat: coord.lat(),
        lng: coord.lng()
      }
    });
    console.log(JSON.stringify(coords, null, 1));


    
    const results = document.getElementById('info') as HTMLElement;
    //results.innerHTML = JSON.stringify(coords, null, 1);

    for(var i = 0; i < coords.length; i++){
      results.innerHTML += polygon.getPath().getAt(i).toUrlValue(6) + "<br>";
    }

    let yearAndMonth: {year: number, month: number}[] = [
      // {"year": 2019, "month": 10},
      // {"year": 2019, "month": 11},
      // {"year": 2019, "month": 12},
      // {"year": 2020, "month": 1},
      // {"year": 2020, "month": 2},
      // {"year": 2020, "month": 3},
      // {"year": 2020, "month": 10},
      // {"year": 2020, "month": 11},
      // {"year": 2020, "month": 12},
      // {"year": 2021, "month": 1},
      // {"year": 2021, "month": 2},
      // {"year": 2021, "month": 3},
      // {"year": 2021, "month": 10},
      // {"year": 2021, "month": 11},
      // {"year": 2021, "month": 12},
      // {"year": 2022, "month": 1},
      // {"year": 2022, "month": 2},
      {"year": 2022, "month": 3}
    ];

    yearAndMonth.forEach(function(value){
      let apiUri = createPoliceApiUri(coords, value.year, value.month);
      
      setTimeout(() => { let foo = 1 === 1; }, 100);

      api<Crime[]>(apiUri)
      .then(crimes => {
      results.innerHTML += `<h2>${crimes.length} crimes reported for year:${value.year} and month:${value.month}</h2>`
      crimes.forEach(function(value){        
        results.innerHTML += `<br />${JSON.stringify(value)}`
      })      
     });
    });

    //let apiUri = createPoliceApiUri(coords, 2021, 10);
    //results.innerHTML += `<br />${apiUri}`;
    
    //let responseData = '';
    //let foobar = api<Crime[]>(apiUri)
    //.then(crimes => { responseData += crimes.map(c => c.category) });    

    //let foobar = api<Crime[]>(apiUri)
    //.then(crimes => {
    //  crimes.forEach(function(value){
    //    results.innerHTML += `<br />${JSON.stringify(value)}`
    //  })      
    // });   

  });

  drawingManager.setMap(map);
}

function createPoliceApiUri(polyCoords: any, year: number, month: number){
  var zeroFilledMonth = ('00' + month).slice(-2);
  var coordsString = '';
  for(var i = 0; i < polyCoords.length; i++){
    coordsString += `${polyCoords[i].lat},${polyCoords[i].lng}${i + 1 === polyCoords.length ? '' : ':'}`;
  }
  return `https://data.police.uk/api/crimes-street/all-crime?poly=${coordsString}&date=${year}-${month}`;
};

function api<T>(uri: string) : Promise<T> {
  return fetch(uri)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
  .then(data => { 
    return data as T;
  })
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
