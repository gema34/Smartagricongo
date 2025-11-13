// Chatbot JavaScript
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-button" id="chatbotToggle">
                    <i class="fas fa-comments"></i>
                </button>
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <h3>
                            <i class="fas fa-robot"></i>
                            Assistant Agricole
                        </h3>
                        <button class="close-btn" id="chatbotClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages"></div>
                    <div class="chatbot-input-container">
                        <input 
                            type="text" 
                            class="chatbot-input" 
                            id="chatbotInput" 
                            placeholder="Posez votre question..."
                            autocomplete="off"
                        >
                        <button class="chatbot-send-btn" id="chatbotSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbotToggle');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        const window = document.getElementById('chatbotWindow');

        toggleBtn.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (this.isOpen && !window.contains(e.target) && !toggleBtn.contains(e.target)) {
                // Ne pas fermer si on clique dans le chatbot
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbotWindow');
        if (this.isOpen) {
            window.classList.add('active');
            document.getElementById('chatbotInput').focus();
        } else {
            window.classList.remove('active');
        }
    }

    close() {
        this.isOpen = false;
        document.getElementById('chatbotWindow').classList.remove('active');
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: 'Bonjour ! Je suis votre assistant agricole. Je peux vous aider avec des conseils sur les cultures (manioc, banane, maïs, haricot), les techniques agricoles et les meilleures pratiques. Comment puis-je vous aider ?',
            time: new Date()
        };
        this.addMessage(welcomeMessage);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        const time = message.time.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${message.type === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                ${this.formatMessage(message.content)}
                <div class="message-time">${time}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(content) {
        // Convertir les sauts de ligne en <br>
        return content.replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');
        const message = input.value.trim();

        if (!message) return;

        // Désactiver l'input et le bouton
        input.disabled = true;
        sendBtn.disabled = true;

        // Ajouter le message de l'utilisateur
        const userMessage = {
            type: 'user',
            content: message,
            time: new Date()
        };
        this.addMessage(userMessage);

        // Vider l'input
        input.value = '';

        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            this.hideTypingIndicator();

            if (data.error) {
                throw new Error(data.error);
            }

            // Ajouter la réponse du bot
            const botMessage = {
                type: 'bot',
                content: data.response,
                time: new Date()
            };
            this.addMessage(botMessage);

        } catch (error) {
            this.hideTypingIndicator();
            console.error('Erreur chatbot:', error);
            
            const errorMessage = {
                type: 'bot',
                content: 'Désolé, une erreur s\'est produite. Veuillez réessayer plus tard. Si le problème persiste, vérifiez que la clé API OpenAI est correctement configurée.',
                time: new Date()
            };
            this.addMessage(errorMessage);
        } finally {
            // Réactiver l'input et le bouton
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialiser le chatbot quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

