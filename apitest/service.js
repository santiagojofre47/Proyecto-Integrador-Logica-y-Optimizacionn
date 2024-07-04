const axios = require('axios');
const IBM = require('ibm-cos-sdk');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let api = fs.readFileSync('api.txt', 'utf8')
let cos = fs.readFileSync('COSinstance.txt', 'utf8')
let config = {
    endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
    apiKeyId: api,
    serviceInstanceId: cos,
    signatureVersion: 'iam',
};

cos = new IBM.S3(config);
let token
try {  
    token = fs.readFileSync('token.txt', 'utf8');    
} catch(e) {
    console.log('Error:', e.stack);
}




configRunJob = {
    method: 'POST',
    url: "https://api.dataplatform.cloud.ibm.com/v2/jobs/b99914dd-2fb9-4e7c-97c4-8b493bd100c3/runs?space_id=f24feae9-b276-4e54-8e9d-9b141377ed35",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    
};

configGetJobStatus = {
    method: 'GET',
    url: "",
    headers: {
      'Authorization': `Bearer ${token}`
    },
}



function createTextFile(bucketName, itemName, fileText) {
    console.log(`Creating new item: ${itemName}`);
    return cos.putObject({
        Bucket: bucketName,
        Key: itemName,
        Body: fileText
    }).promise()
    .then(() => {
        console.log(`Item: ${itemName} created!`);
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
        throw e;
    });
}



function getObject(bucketName,objectName){
    return cos.getObject(
        {Bucket:bucketName,
         Key:objectName
        }
    ).promise()
    .then((data) =>{
        var buffer = Buffer.from(data.Body)
        return buffer.toString();
    })
    .catch((e)=>{
        console.log(`ERROR: ${e.code} - ${e.message}\n`);
        throw e;
    }
    )
}

function getJobStatus(jobId){
    configGetJobStatus.url = `https://us-south.ml.cloud.ibm.com/ml/v4/deployment_jobs/${jobId}?space_id=f24feae9-b276-4e54-8e9d-9b141377ed35&version=2024-06-12`
    return axios(configGetJobStatus).then(response => {
        return response.data
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      throw error;
    });
}

function runJob(){
    return axios(configRunJob)
    .then(response => {
        return response.data
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      throw error;
    });
  
};

async function resolverProblema(){
    let band = true
    let problemaCreado = await runJob()
    
    
    while(band){
        

        
        let estado = await getJobStatus(problemaCreado.entity.job_run.runtime_job_id)
        
        if (estado.entity.decision_optimization.status.state === 'completed'){
            band = false
        }
            
        
        await delay(5000)
        

    }
    let estado = await getJobStatus(problemaCreado.entity.job_run.runtime_job_id)
    if (estado.entity.decision_optimization.solve_state.solve_status === "infeasible_solution"){
        return "Solucion imposible"
    }
    else{
        return getObject("problemadelamochila-donotdelete-pr-jgeu0m8bmon0aw","solucion.csv")
    }
   


   

}


module.exports = {createTextFile,resolverProblema};

