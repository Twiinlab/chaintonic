const erisDbFactory = require('eris-db');
const erisContracts = require('eris-contracts');
const solc = require('solc');
const accounts = require("./accounts.js").accounts;
const nodes = require("./ips.js").ips;

var erisdb; /* ErisDB Factory */
var erisdbURL; /* ErisDB RPC URL */
var pipe; /* Pipe for creating contracts */
var contractManager;/* Contract Manager for creating contracts*/
var account = accounts[0].address;
var greeterSource = 'contract greeter { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } function changeGreet(string _greeting){ greeting = _greeting;}}'


/*Initialize ERISDB*/
erisdb = erisDbFactory.createInstance("http://192.168.99.101:1337/rpc");
erisdb.start(function(error){
    if(!error){
        console.log("Ready to go");
    }
});

pipe = new erisContracts.pipes.DevPipe(erisdb, accounts); /* Create a new pipe*/
contractManager = erisContracts.newContractManager(pipe); /*Create a new contract object using the pipe */

/*Get account list*/
erisdb.accounts().getAccounts((err, res) => { console.log(res.accounts.map(item => {
  return ({
    ADDR: item.address,
    BALANCE: item.balance
  })
})) });

/* Compile the Greeter Contract*/
var compiledContract = solc.compile(greeterSource);
//console.log(compiledContract)
var contractFactory = contractManager.newContractFactory(JSON.parse(compiledContract.contracts.greeter.interface)); //parameter is abi
// console.log(contractFactory)

/* Send the contract */
contractFactory.new.apply(contractFactory, ["Hello World",
 {from: account, data:compiledContract.contracts.greeter.bytecode}, (err, contractInstance)=> {
  console.log(contractInstance.address);
  //get data from contract
  contractInstance["greet"].apply(contractInstance, [(error,result)=> {
     if (error) {
       console.log(error);
     }
    else {
      console.log(result);


      contractInstance2 = contractFactory.at(contractInstance.address);
      contractInstance2["changeGreet"].apply(contractInstance2, [ "hello hackathon", {from: account}, () => {
          contractInstance2["greet"].apply(contractInstance2, [(error,result)=> {
             if (error) {
               console.log(error);
             }
            else {
              console.log(result);
          }
      } ])}]);

    }
  }]);

 }]);
