WhatsApp Message Sender Bot
Este bot envia mensagens personalizadas via WhatsApp utilizando a biblioteca Venom-bot. Ele lê uma lista de números do arquivo numeros.txt e uma mensagem do arquivo mensagem.txt, formata os números para o padrão brasileiro com DDI +55 e envia a mensagem para cada contato.

Para evitar bloqueios, o envio é feito com um delay aleatório entre 30 segundos e 2 minutos entre cada mensagem. Caso ocorra algum erro durante o envio, ele será registrado no arquivo erros.txt para que você possa analisar depois.

Para usar o bot, basta instalar as dependências com npm install venom-bot, configurar os arquivos de números e mensagem, e executar o script com node seu_script.js. Na primeira execução, será necessário escanear o QR Code gerado para autenticar a sessão do WhatsApp.

Use este bot com responsabilidade, respeitando a privacidade dos destinatários e garantindo que as mensagens sejam enviadas apenas para contatos que autorizaram o contato.
