
const cardbox = document.getElementById('cardbox');
const endgame_message = document.getElementById('endgame-messagebox');;
const messages = {'win_message': {'en': 'Congratulations! You matched all word pairs!', 'ar': 'تهانينا! لقد قمت بمطابقة جميع أزواج الكلمات!', 'zh': '恭喜！您匹配了所有单词对！', 'fr': 'Toutes nos félicitations! Vous avez trouvé toutes les paires de mots\xa0!', 'de': 'Glückwunsch! Du hast alle Wortpaare gefunden!', 'ja': 'おめでとう！すべての単語のペアが一致しました。', 'ko': '축하해요! 모든 단어 쌍이 일치했습니다!', 'pt': 'Parabéns! Você combinou todos os pares de palavras!', 'ru': 'Поздравляем! Вы совпали со всеми парами слов!', 'es': '¡Felicidades! ¡Has coincidido con todos los pares de palabras!', 'ta': 'வாழ்த்துகள்! எல்லா வார்த்தை ஜோடிகளையும் பொருத்திவிட்டீர்கள்!'}, 'lose_message': {'en': 'You ran out of lives, try again tommorow!', 'ar': 'لقد نفدت حياتك، حاول مرة أخرى غدًا!', 'zh': '你的生命已用完，明天再试一次！', 'fr': 'Vous n&#39;avez plus de vies, réessayez demain\xa0!', 'de': 'Ihnen sind die Leben ausgegangen. Versuchen Sie es morgen noch einmal!', 'ja': 'ライフがなくなりました。明日もう一度試してください。', 'ko': '수명이 부족합니다. 내일 다시 시도하세요!', 'pt': 'Você ficou sem vidas, tente novamente amanhã!', 'ru': 'У вас закончились жизни, повторите попытку завтра!', 'es': '¡Se te acabaron las vidas, inténtalo de nuevo mañana!', 'ta': 'நீங்கள் உயிர் இழந்துவிட்டீர்கள், நாளை மீண்டும் முயற்சிக்கவும்!'}, 'Easy': {'en': 'Level 1', 'ar': 'المستوى 1', 'zh': '1级', 'fr': 'Niveau 1', 'de': 'Stufe 1', 'ja': 'レベル1', 'ko': '레벨 1', 'pt': 'Nível 1', 'ru': '1-й уровень', 'es': 'Nivel 1', 'ta': 'நிலை 1'}, 'Medium': {'en': 'Level 2', 'ar': 'المستوي 2', 'zh': '2级', 'fr': 'Niveau 2', 'de': 'Stufe 2', 'ja': 'レベル2', 'ko': '2 단계', 'pt': 'Nível 2', 'ru': 'Уровень 2', 'es': 'Nivel 2', 'ta': 'நிலை 2'}, 'Hard': {'en': 'Level 3', 'ar': 'مستوى 3', 'zh': '3级', 'fr': 'Niveau 3', 'de': 'Stufe 3', 'ja': 'レベル3', 'ko': '레벨 3', 'pt': 'Nível 3', 'ru': 'Уровень 3', 'es': 'Nivel 3', 'ta': 'நிலை 3'}}
const language_names_translated= ['English','عربي', '中国人', 'Français', 'Deutsch', '日本語', '한국인', 'Português', 'Русский', 'Español', 'தமிழ்']
const language_codes = ['en','ar','zh','fr','de','ja','ko','pt','ru','es','ta']
var src_lg = localStorage.getItem('src_lg')
var tgt_lg = localStorage.getItem('tgt_lg')

if (!src_lg){src_lg='en'};
if (!tgt_lg){tgt_lg='es'};

// this basically just tries to coerce the servers time reset to the users
var current_date = new Date();
current_date = `${current_date.getDate()}/${current_date.getMonth()+1}/${current_date.getFullYear()}`;
const cached_date = localStorage.getItem('date');
var wipe = false;
if (cached_date!=current_date){
    wipe = true; // wipe user data if rollover
    localStorage.setItem('date',current_date); //set time of wipe
}else{localStorage.setItem('date',cached_date)} // pass on cached date
console.log(daily_word_data);
console.log(daily_word_data[current_date])
//pull daily word data for todays date in local time
daily_word_data = daily_word_data[current_date];
puzzle_number = puzzle_numbers[current_date];
document.getElementById('puzzle-number').innerHTML=`#${puzzle_number}`;
var share_message = `https://Word.Earth #${puzzle_number}`;

function addLanguages(element,init_val){
    for (i=0;i<language_codes.length;i++){
        temp_node = document.createElement('option');
        temp_node.value=language_codes[i];
        temp_node.classList.add('language-option');
        temp_node.innerHTML=language_names_translated[i];
        element.appendChild(temp_node);
    }
    element.value=init_val;
}

const src_listbox = document.getElementById('source-language-listbox');
const tgt_listbox = document.getElementById('target-language-listbox');
addLanguages(src_listbox,src_lg);
addLanguages(tgt_listbox,tgt_lg);

src_listbox.addEventListener('change',changeSourceLanguage);
tgt_listbox.addEventListener('change',changeTargetLanguage);

function changeSourceLanguage(event){
    src_lg = src_listbox.value;
    localStorage.setItem('src_lg',src_lg);
    setEndMessage(daily_cardsets[[...daily_puzzle_ribbon.childNodes].filter((child)=>[...child.classList].includes('active'))[0].id].end_message);
    [...daily_puzzle_ribbon.childNodes].forEach((child)=>{child.innerHTML=messages[child.id][src_lg]})
    cycleCardset()
}

function changeTargetLanguage(event){
    tgt_lg = tgt_listbox.value;
    localStorage.setItem('tgt_lg',tgt_lg);
    cycleCardset()
}


class CardSet{
	constructor(title,card_order=null,solved_state=null){
		this.title = title;
        this.card_order = card_order? card_order : this.generateCardOrder(title);
        this.cards =[];
		this.buildCardSet(title,solved_state);
		this.allSolved = false;
		this.lives = 3;
        this.end_state = null;
        this.end_message = {state:"",color:"green"};
	}

    buildCardSet(title,solved_state){
        this.cards = [];
        console.log(solved_state);
        const src_word_data = daily_word_data[title][src_lg];
        const tgt_word_data = daily_word_data[title][tgt_lg];
        for (i=0;i<this.card_order.length;i++){
            const card_pair = [src_word_data[i],tgt_word_data[i]]
            var temp_card = new Card(card_pair,this)
            if (solved_state){
                if (solved_state[i]){
                    temp_card.isSolved = true;
                    console.log('FLAG')
                }
            }
            console.log(`INIT STATE ${solved_state}`);
            this.cards.push(temp_card)
        }
    }

	checkSolved(){
		this.allSolved = this.cards.every((card)=>card.isSolved);
        if (this.allSolved){this.Win()}
	}

	generateCardOrder(title){
        var back_card_indices = [...Array(daily_word_data[title]['en'].length).keys()];
        var card_order = []
		while (back_card_indices.length>0){
			const i = Math.floor(Math.random() * back_card_indices.length);
			card_order.push(back_card_indices.splice(i,1)[0]);
		}
        console.log(card_order);
        return card_order;
	}

    showCards(){
        for (i=0;i<this.card_order.length;i++){
            cardbox.appendChild(this.cards[i].card['front'])
            cardbox.appendChild(this.cards[this.card_order[i]].card['back']);
            if (this.cards[i].isSolved){this.cards[i].solve()}
        }
        cardbox.style.gridTemplateRows= `repeat(${daily_word_data[this.title]['en'].length},1fr)`;
        setLives(this.lives);
        setEndMessage(this.end_message);
    }
    hideCards(){
        this.cards.forEach((card)=>{
            cardbox.removeChild(card.card['front']);
            cardbox.removeChild(card.card['back']);
        })
    }
    

	minus(){
		this.lives -= 1;
        setLives(this.lives)
        console.log(`${this.title} | Lives Remaining: ${this.lives}`)
		if (this.lives == 0){this.Loss()}
	}

	Loss(){
		this.cards.map((card)=>{card.disable()})
        this.end_message = {state:'lose_message',color:'red'}
        setEndMessage(this.end_message)
        this.end_state = false;
        checkEndState();
	}

    Win(){
        this.end_message = {state:"win_message",color:'green'}
        console.log(`All Cards Solved!`);
        setEndMessage(this.end_message);
        this.end_state = true;
        checkEndState();
    }
    destroy(){
        this.cards = null;
    }

}
class Card {
	constructor(pair,cardset){
		this.cardset=cardset;
		this.text={'front':pair[0],'back':pair[1]};
		this.card={'front':this.addCard('front'),'back':this.addCard('back')};
		this.isActive={'front':false,'back':false};
		this.isSolved= false;
	}
	addCard(side){
		const card = document.createElement("div");
		card.classList.add("card","unsolved");
		card.innerHTML = this.text[side];
        if (this.text[side].length>=11 && screen.width<770){
            card.setAttribute('style','font-size: .5em !important');
        }
		card.side = side;
		card.addEventListener(screen.width<770? 'touchstart' : 'click',this.handleClick);
		return card
	}
	handleClick = (event) => {this.isActive[event.target.side]? this.deselect(event.target.side) : this.select(event.target.side)}
	select(side){
		this.cardset.cards.map((card)=>{if (card.isActive[side] && !card.isSolved){card.deselect(side)}});
		this.isActive[side] = true;
		this.card[side].style.backgroundColor = 'rgb(100,255,100)';
		console.log(`Card ${this.text[side]} -> ${this.isActive[side]}`);
		const other_side = side=="front"?"back":"front";
		if (this.isActive[other_side]){this.solve()}
		else {
			const clicked_card = this.cardset.cards.filter((card)=>card.isActive[other_side]);
			console.log(clicked_card);
            if (clicked_card.length>0){
				this.cardset.minus();
				clicked_card[0].deselectWrong(other_side);
				this.deselectWrong(side);
			}
		}
	}
	deselect(side){
		this.isActive[side] = false;
		this.card[side].style.backgroundColor = 'rgb(255,255,255)';
		console.log(`Card ${this.text[side]} -> ${this.isActive[side]}`);
	}
	deselectWrong(side){
		if (this.cardset.lives>0){
			this.isActive[side] = false;
			this.card[side].classList.remove('unsolved');
			this.card[side].style.backgroundColor = 'rgb(255,30,30)';
			setTimeout((card,classlist)=>{card.style.backgroundColor = 'rgb(255,255,255)';classlist.add('unsolved')},screen.width<770? 100:300,this.card[side],this.card[side].classList);
		}
        saveState();
	}
	solve(){
		this.isSolved = true;
		console.log(`Card (${this.text["front"]},${this.text["back"]}) Solved`);
		this.disable();
		this.cardset.checkSolved();
        saveState();
	}
	disable(){
		Object.values(this.card).map((card)=>{card.removeEventListener(screen.width<770? 'touchstart' : 'click',this.handleClick);
												card.style.backgroundColor='rgb(150,150,150)';
												card.style.color='rgb(100,100,100)';
												card.classList.remove("unsolved")});
		this.isActive={'front':false,'back':false};
	}
}

const empty_heart = "./assets/heart_empty.png";
const full_heart = "./assets/heart_full.png";
const hearts  = [...document.getElementById('heart-box').childNodes].filter((element)=>element.tagName == 'IMG');
console.log(hearts);

function setLives(lives){
    for (i=0;i<3;i++){
        hearts[i].src = lives>i? full_heart : empty_heart;
    }

}

const setEndMessage = (end_message) => {endgame_message.innerHTML=(end_message.state=="")?"":messages[end_message.state][src_lg];endgame_message.style.color=end_message.color;console.log(end_message)};

function saveState(){
    var solved_states = {};
    var card_orders = {};
    var end_states = {};
    var lives = {};
    Object.keys(daily_cardsets).forEach((key)=>{
        console.log(key);
        solved_states[key] = daily_cardsets[key].cards.map((card)=>card.isSolved);
        card_orders[key] = daily_cardsets[key].card_order;
        end_states[key] = daily_cardsets[key].end_state;
        lives[key] = daily_cardsets[key].lives;
    })
    localStorage.setItem('solved_states',JSON.stringify(solved_states));
    localStorage.setItem('card_orders',JSON.stringify(card_orders));
    localStorage.setItem('end_states',JSON.stringify(end_states));
    localStorage.setItem('lives',JSON.stringify(lives));
}

function generate_cardset(set_label,card_order=null,solved_states=null){
	const src_db = daily_word_data[set_label][src_lg];
	const tgt_db = daily_word_data[set_label][tgt_lg];
	return new CardSet(set_label,card_order? card_order[set_label] : null,solved_states? solved_states[set_label] : null);
}



function eliminateCards(){
    daily_cardsets[[...daily_puzzle_ribbon.childNodes].filter((child)=>[...child.classList].includes('active'))[0].id].hideCards()
}

function cycleCardset(){
    eliminateCards()
    Object.values(daily_cardsets).forEach((cardset)=>cardset.destroy())
    daily_cardsets = {
        "Easy":generate_cardset("Easy"),
        "Medium":generate_cardset("Medium"),
        "Hard":generate_cardset("Hard"),
    } 
    daily_cardsets[[...daily_puzzle_ribbon.childNodes].filter((child)=>[...child.classList].includes('active'))[0].id].showCards();
}


daily_puzzle_ribbon = document.getElementById('puzzle-select-ribbon')
const destroyAlert = () => { document.getElementById('visit-alert').remove();localStorage.setItem('visited',true)}

function checkEndState(){
    console.log('CHECKING END STATE');
    if (Object.values(daily_cardsets).map((cardset)=>cardset.end_state).every((isSolved)=>isSolved!=null)){
        share_message = `https://Word.Earth #${puzzle_number} \n${language_names_translated[language_codes.findIndex((lg)=>lg==src_lg)]} ➡️ ${language_names_translated[language_codes.findIndex((lg)=>lg==tgt_lg)]} \n`;
        Object.values(daily_cardsets).forEach((cardset)=>{
            share_message += cardset.end_state? '✅' : '❌';
            for (k=1;k<4;k++){share_message += k<=cardset.lives? '❤️':'💔'};
            share_message += '\n';
        })
        console.log(share_message);
    }
}

document.getElementById('share-button').addEventListener(screen.width<770? 'touchstart' : 'click',(event)=>{
    tooltip = [...event.target.childNodes][1];
    navigator.clipboard.writeText(share_message);
    console.log(tooltip);
    tooltip.innerHTML = 'copied!';
    tooltip.classList.add('copy-active');
    setTimeout(()=>tooltip.style.opacity = 0,500);
    setTimeout(()=>{
        tooltip.classList.remove('copy-active');
        tooltip.innerHTML = 'Share!';
        tooltip.style.opacity = 1;
    },1500)
    
})

function init_page(wipe){
    //pull from cache
    init_solved = localStorage.getItem('solved_states');
    init_card_order = localStorage.getItem('card_orders');
    init_end_states = localStorage.getItem('end_states');
    init_lives = localStorage.getItem('lives');
    //parse if data is cached, set default value otherwise
    if (init_solved!=null){init_solved=JSON.parse(init_solved)};
    if (init_card_order!=null){init_card_order=JSON.parse(init_card_order)};
    init_end_states = init_end_states? JSON.parse(init_end_states) : {"Easy":null,"Medium":null,"Hard":null};
    init_lives = init_lives?  JSON.parse(init_lives) : {"Easy":3,"Medium":3,"Hard":3};
    if (wipe){ //wipe all cached data and init default
        init_solved = null;
        init_card_order = null;
        init_end_states = {"Easy":null,"Medium":null,"Hard":null};
        init_lives = {"Easy":3,"Medium":3,"Hard":3};
        localStorage.setItem('solved_states',null);
        localStorage.setItem('card_orders',null);
        localStorage.setItem('end_states',null);
        localStorage.setItem('lives',null);
    }
    daily_cardsets = {
        "Easy":generate_cardset("Easy",init_card_order,init_solved),
        "Medium":generate_cardset("Medium",init_card_order,init_solved),
        "Hard":generate_cardset("Hard",init_card_order,init_solved),
    }
    console.log(init_end_states);
    if (!wipe){
        Object.keys(daily_cardsets).forEach((key)=>{
            daily_cardsets[key].lives = init_lives[key];
            if (init_end_states[key]!=null){
                init_end_states[key]? daily_cardsets[key].Win() : daily_cardsets[key].Loss();
            }
        })
    }
    Object.keys(daily_cardsets).forEach((key)=>{
        const new_button = document.createElement("button");
        new_button.innerHTML=messages[key][src_lg];
        new_button.id = key;
        new_button.addEventListener(screen.width<770? 'touchstart' : 'click',(event)=>{
            previous = [...event.target.parentElement.childNodes].filter((child)=>[...child.classList].includes("active"))[0];
            console.log(previous)
            previous.classList.remove("active");
            daily_cardsets[previous.id].hideCards();
            event.target.classList.add('active');
            daily_cardsets[event.target.id].showCards();
            localStorage.setItem('tab',key);
        })
        daily_puzzle_ribbon.appendChild(new_button);
    })
    init_tab = localStorage.getItem('tab');
    daily_cardsets[init_tab? init_tab : "Easy"].showCards();
    daily_puzzle_ribbon.children[init_tab?{"Easy":0,"Medium":1,"Hard":2}[init_tab]:0].classList.add("active")
    saveState();
    localStorage.getItem('visited')? destroyAlert() : document.getElementById('destroy-button').addEventListener(screen.width<770? 'touchstart' : 'click',destroyAlert);
}

init_page(wipe)


