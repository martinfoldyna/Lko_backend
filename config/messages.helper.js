module.exports = {
    AUTH: {
        LOGIN: {
            SUCCESS: {
                message: 'Nyní jste úspěšně přihlášen(a)',
                status: 200,
                success: true
            },
        },
        WAIT_FOR_VERIFICATION: {
            message: 'Vyčkejte, než vám administrátor umožní přístup do aplikace.',
            status: 401,
            success: false
        },
        USE_ANOTHER_USER: {
            message: 'K přihlášení použijte @pslib.cz, @pslib.cloud, @365.pslib.cz účet.',
            status: 403,
            success: false
        }

    },
    ERROR: {
        OCCURED: {
            message: 'Vyskytla se neočekávaná chyba. Zkuste to prosím znovu',
            status: 500,
            success: false
        }
    },
    PHOTO: {
        NOT_FOUND: {
            message: 'Požadované obrázky nebyly nalezeny.',
            status: 404,
            success: false
        },
        ALL_UPLOADED: {
            message: 'Všechny obrázky byly úspěšně nahrány.',
            status: 200,
            success: true
        },
        ONE_UPLOADED: {
            message: 'Obrázek byl úspěšně nahrán.',
            status: 200,
            success: true
        },
        ALL_LOADED: {
            message: 'Všechny obrázky byly načteny.',
            status: 200,
            success: true
        },
        ONE_LOADED: {
            message: 'Obrázek byl načten.',
            status: 200,
            success: true
        },
        ALL_DELETED: {
            message: 'Obrázky byly odstraněny.',
            status: 200,
            success: true
        },
        ONE_DELETED: {
            message: 'Obrázek byl odstraněn.',
            status: 200,
            success: true
        },
        UPDATED: {
            message: 'Obrázek byl úspěšně upraven.',
            status: 200,
            success: true
        }
    },
    POST: {
        NOT_FOUND: {
            message: 'Požadované příspěvky nebyly nalezeny.',
            status: 404,
            success: false
        },
        UPLOADED: {
            message: 'Příspěvek byl úspěšně nahrán.',
            status: 200,
            success: true
        },
        DELETED: {
            message: 'Příspěvek byl odstraněn.',
            status: 200,
            success: true
        },
        ALL_LOADED: {
            message: 'Příspěvky byly načteny.',
            status: 200,
            success: true
        },
        UPDATED: {
            message: 'Příspěvek byl aktualizován.',
            status: 200,
            success: true
        },


    },
    USER: {
        AUTHORISED: {
            message: 'Uživatel byl oprávněn ke vstupu do aplikace.',
            status: 200,
            success: true
        },
        UPDATED: {
            message: 'Uživatel byl aktualizován.',
            status: 200,
            success: true
        },
        MUTLIPLE_NOT_FOUND: {
            message: 'Uživatelé nebyli nalezeni.',
            status: 404,
            success: false
        },
        ONE_NOT_FOUND: {
            message: 'Uživatel nebyl nalezen.',
            status: 404,
            success: false
        },
        ONE_LOADED: {
            message: 'Uživatel byl načten.',
            status: 200,
            success: true
        },
        MULTI_LOADED: {
            message: 'Uživatelé byli načteni.',
            status: 200,
            success: true
        },
        DELETED: {
            message: 'Uživatel byl odstraněn.',
            status: 200,
            success: true
        },
        DEAUTHORISED: {
            message: 'Uživateli bylo odebráno oprávnění k přístupu do aplikace.',
            status: 200,
            success: true
        },
        NOT_AUTHORISED: {
            message: 'K této akci nejste oprávněni.',
            status: 401,
            success: false
        }

    },
}
