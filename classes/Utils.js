class Utils {

    static dateFormat(data){
        return data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear()+' '+data.getHours()+':'+data.getMinutes();
    }
}