/**
 * The message entity
 */
export default class Message {

    text: string;
    place: any;
    coordinates: any;

    constructor(text, place, coordinates) {
        this.text = text;
        this.place = place;
        this.coordinates = coordinates;
    }

    isValid() {
        return !!this.text;
    }

    isLocalized() {
        const allowedTypes = ['poi', 'neighborhood', 'city'];
        if (this.place && allowedTypes.includes(this.place.place_type)) {
          return true;
        }
        return !!this.coordinates;
    }

    includesText(text: string) {
        return this.text.includes(text);
    }

    getText() {
        return this.text;
    }
}