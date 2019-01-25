import './index.sass';

class Hellower {
   constructor(private name:string) {

   }

   public sayHello(): void {
      console.log(`Hi, my name is ${this.name}`);
   }
}

const hellower1 = new Hellower("Test1");
const hellower2 = new Hellower("Test2");

hellower1.sayHello();
hellower2.sayHello();