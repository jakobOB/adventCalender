import vocabularyData from '@/assets/data/vocabularyData.json';
import sentenceData from '@/assets/data/sentenceComplitionData.json';
import listeningData from '@/assets/data/listeningData.json';
import translationData from '@/assets/data/translationData.json';

export class LocalStorageService {
     initializeLocalStorage() {
        if (!localStorage.getItem('Listening')) {
            localStorage.setItem('Listening', JSON.stringify(listeningData));
        }

        if (!localStorage.getItem('Sentence Completion')) {
            localStorage.setItem('Sentence Completion', JSON.stringify( sentenceData));
        }

        if (!localStorage.getItem('Translation')) {
            localStorage.setItem('Translation', JSON.stringify(translationData));
        }

        if (!localStorage.getItem('Vocabulary')) {
            localStorage.setItem('Vocabulary', JSON.stringify(vocabularyData));
        }

        if (!localStorage.getItem('doorsOpened')) {
            localStorage.setItem('doorsOpened', '0');
        }
    }

    clearLocalStorage() {
        localStorage.clear();
    }

    getData(storage) {
        return JSON.parse(localStorage.getItem(storage));
    }

    storeData(storage, data) {
        localStorage.setItem(storage, JSON.stringify(data));
    }
}
