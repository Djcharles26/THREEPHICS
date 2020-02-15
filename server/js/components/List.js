class List{
    array = [];
  
    constructor(array){
      this.array = array;
    }
  
    getItem(index){
      return this.array[index];
    }
  
    contains(item){
      this.array.forEach((element) => {
        if(element === index) return true;
      })
      return false;
    }
  
    sortUp(){
      this.array.sort((a,b) => {
        return a-b;
      })
    }
  
    sortDown(){
      this.array.sort((a,b) => {
        return b-a;
      })
    }
  
  
    add(item){
      this.array.push(item);
    }
  
  
    remove(index){
      this.array.splice(index,1);
    }
  
    remove(item){
      this.array.forEach((element, i)=> {
        if(elemnt ===  item){
          this.array.splice(i, 1);
          break;
        }
      })
    }
  
    toArray(){
      return this.array;
    }
  }
  
  export default List;