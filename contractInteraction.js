/*
* Class name : contractInteraction.js
* Creation date : 24/11/2016
* Author : David Sanchez Seco
*/

const erisDbFactory = require('eris-db');
const erisContracts = require('eris-contracts');
const solc = require('solc');
const fs = require('fs');


const accounts = require('./accounts.js').accounts;
const erisdbURL = "http://192.168.99.101:1337/rpc" ; //require('./config/erisdbURL.js').erisdbURL;



var erisdb;
var contractManager;
var compiledContract;
var contractIncubatorFactory;

var deployedPolicies = [];

initialize = function(){
    erisdb = erisDbFactory.createInstance(erisdbURL);
    contractManager = erisContracts.newContractManagerDev(erisdbURL, accounts);

    contract = fs.readFileSync('./contracts/incubator.sol', 'utf-8');
    if(contract){
        //compiledContract = solc.compile(contract, 1).contracts.incubator;
        //policyFactory = contractManager.newContractFactory(JSON.parse(compiledContract.interface)); //parameter is abi
        compiledContract = solc.compile(contract);
        contractIncubatorFactory = contractManager.newContractFactory(JSON.parse(compiledContract.contracts.incubator.interface));
        console.log("initialized");
    }else{
        console.error("Could not find contract");
    }
}

/**
*   Esentially deploy and transaction are the same, the diferrence is that on
*   deploy, after the params of the function it's sent an object with from
*   (also for transaction) and data which is the compiled contract bytecode
*/


/* Deploy the policy */
function deployPolicy(_constructorParams,_account){
    return new Promise((resolve, reject) => {
        policyFactory.new(_constructorParams.policyId,_constructorParams.hedges,
            _constructorParams.bounty,_constructorParams.policyCreationDate,
            _constructorParams.policyExpirationDate,
            {from: _account, data: compiledContract.bytecode}, function(err, contract){
            if(err) {
                reject(err);
            }else{
                deployedPolicies.push({
                   contract: contract,
                   owner: _account
                });
                resolve(contract);
            }
        });
    });
}

/*Gather policy data*/
function consultPolicy( _policyIndex){
    return new Promise((resolve, reject) => {
        var contractInstance = deployedPolicies[_policyIndex];
        contractInstance.contract.getPolicyData.call(function(error,result){
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

/*Change policy status to accepted*/
function acceptPolicy( _policyIndex, _account){
    return new Promise((resolve, reject) => {
        var contractInstance = deployedPolicies[_policyIndex];
        console.log(contractInstance.contract.acceptPolicy)
        contractInstance.contract.acceptPolicy(function(res){
            resolve(res)
        });
    });
}

/*Terminate the policy*/
function rescindPolicy ( _policyIndex){

}

//DELME TEST
initialize()
// deployPolicy({
//     policyId: "123456",
//     hedges: "windows and burns down",
//     bounty: "1000 GBP",
//     policyCreationDate: "24 Nov 2016",
//     policyExpirationDate: "24 Nov 2017"
// },accounts[0].address)
// .then(res => {
//     console.log(res.address)
//     acceptPolicy(0,accounts[0].address)
//     .then(res => {
//         console.log(res)
//         consultPolicy(0)
//         .then(res => { console.log(res); })
//         .catch(err => {
//             console.error(err);
//         })
//     })
// })
// .catch(err => {
//     console.error(err);
// })