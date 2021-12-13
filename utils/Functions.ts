export function twoDigits(date: Date, mode: string):string {
    if(mode === 'minutes') {
      let min = date.getMinutes().toString();
      if(min.length === 1) min = '0'+min

      return min
    } else if(mode === 'hours') {
      let hr = date.getHours().toString();
      if(hr.length === 1) hr = '0'+hr

      return hr
    } else if(mode === 'date') {
      let hr = date.getDate().toString();
      if(hr.length === 1) hr = '0'+hr

      return hr
    } else if(mode === 'month') {
      let hr = date.getMonth().toString();
      if(hr.length === 1) hr = '0'+hr

      return hr
    }
    return ''
  }

  

  export function getStNdRdTh(number: any) {
    if(isNaN(number)) return null;
    if(number > 10 && number < 14) {
        return 'th';
    } else {
        number = number.toString();
        let len = number.length-1;
        number = number.split('');
        if(number[len] === '1') return 'st';
        else if(number[len] === '2') return 'nd';
        else if(number[len] === '3') return 'rd';
        else return 'th';
    }
  }

  export const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  export const day = {
    "id": ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    "en": ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }