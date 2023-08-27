import { el } from 'redom';
import ymaps from 'ymaps';
import { apiGetBanks } from '../api/api';
import createSnackbar from '../elements/snackbar';

export function createAtmsHeader() {
  return el('h2.page-subheader.atms__subheader', 'Карта банкоматов');
}

export function createAtmsMapContainer() {
  const mapContainer = el('#map.map-container');
  return mapContainer;
}

export function mapsInit() {
  ymaps
    .load(
      'https://api-maps.yandex.ru/2.1/?apikey=cd471398-27a8-4dfd-bbe0-c5d8106232d0&lang=ru_RU'
    )
    .then((maps) => {
      const map = new maps.Map(document.getElementById('map'), {
        center: [52, 60],
        zoom: 4,
      });

      map.behaviors.disable('scrollZoom');

      const atmsLocations = apiGetBanks();
      atmsLocations
        .then((atm) => {
          const myCollection = new maps.GeoObjectCollection();

          for (let i = 0; i < atm.payload.length; i++) {
            const { lat } = atm.payload[i];
            const { lon } = atm.payload[i];
            myCollection.add(new maps.Placemark([lat, lon]));
          }
          map.geoObjects.add(myCollection);
        })
        .catch((error) => createSnackbar('error', error.message));
    })
    .catch((error) => createSnackbar('error', error.message));
}
