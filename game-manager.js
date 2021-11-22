/**
 * Клас, який керує грою, запамятовує які карти были відкриті, керує колодою і рахує кількість спроб.
 * Зв'язує JavaScript код з інтерфейсом користувача
 */
class GameManager {
    #boardElement;
    #scoreElement;
    #deck = new Deck();
    #firstCard = null;
    #secondCard = null;
    #attemptNumber = 0;

    constructor(board, score) {
        if (typeof board === "string") {
            this.#boardElement = document.querySelector(board);
        }
        else {
            this.#boardElement = board;
        }

        if (typeof score === "string") {
            this.#scoreElement = document.querySelector(score);
        }
        else {
            this.#scoreElement = score;
        }
    }

    startGame() {
        this.attemptNumber = 0;
        this.#deck = new Deck();
        this.#boardElement.innerHTML = "";
        this.shuffleAndDeal();
    }

    shuffleAndDeal() {
        this.#deck.shuffle();
        this.#deck.cards.forEach(card => {
            this.#boardElement.append(card.element);
        });
    }

    selectCard(card) {
        if(card == this.#firstCard) return; // якщо другий раз натиснули на ту саму карту, нічого не робимо (метод далі не виконуємо)
        card.flip(); // перевертаємо карту

        // якщо є значення у двох полях, значить попередні дві карти не співпали
        // Перевертаємо їх сорочкою вгору
        if (this.#firstCard && this.#secondCard) {
            this.#firstCard.flip();
            this.#secondCard.flip();

            this.#firstCard = this.#secondCard = null;
        }

        // Якщо вибрана одна карта запам'ятовуємо її та чекаємо на другу
        if (this.#firstCard == null) {
            this.#firstCard = card;
        }
        else if (this.#secondCard == null) {
            this.attemptNumber++;
            this.#secondCard = card;

            // якщо знайдено карти з однаковим зображенням
            if (this.#firstCard.imagePath === card.imagePath) {
                this.#deck.removeCard(this.#firstCard); // прибираємо карти з колоди (вони залишаються в DOM дереві)
                this.#deck.removeCard(this.#secondCard);

                this.#firstCard = this.#secondCard = null; 
            }
        }
    }

    get attemptNumber() {
        return this.#attemptNumber;
    }

    set attemptNumber(value) {
        this.#attemptNumber = value;
        this.#scoreElement.innerHTML = value;
    }
}
