const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function main() {

  const keyVaultName = process.env["KEY_VAULT_NAME"];
  const KVUri = "https://" + keyVaultName + ".vault.azure.net";

  const credential = new DefaultAzureCredential();
  const client = new SecretClient(KVUri, credential);

  const secretName = "mySecret";
  var secretValue = await askQuestion("Input the value of your secret > ");

  console.log("Creating a secret in " + keyVaultName + " called '" + secretName + "' with the value '" + secretValue + "` ...");
  await client.setSecret(secretName, secretValue);

  console.log("Done.");

  console.log("Forgetting your secret.");
  secretValue = "";
  console.log("Your secret is '" + secretValue + "'.");

  // -- Uncomment these 3 lines to retrieve your secret --
  // console.log("Retrieving your secret from " + keyVaultName + ".");
  // const retrievedSecret = await client.getSecret(secretName);
  // console.log("Your secret is '" + retrievedSecret.value + "'.");

  // -- Uncomment these 3 lines to delete your secret --
  // console.log("Deleting your secret from " + keyVaultName + " ...");
  // await client.beginDeleteSecret(secretName);
  // console.log("Done.");
}

main()
