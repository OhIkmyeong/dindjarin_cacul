export class DinCacul{
    constructor(){
        this.mm = 'ipt-mm';
        this.dj = 'ipt-dd';
        this.DJR = 45000;
        this.DOLLAR = undefined;
        this.$sel_mm = document.getElementById('sel-mm');
        this.error = '숫자를 제대로 입력해주세요';
    }

    async init(){
        //fetch 해서 환율 등록
        this.DOLLAR = await this.get_exchange_rate();

        //ipt에 keyup 이벤트 등록
        const $$ipt = document.querySelectorAll('.ipt');
        for(let $ipt of $$ipt){this.add_on_keyup($ipt);}
    }//init

    add_on_keyup($ipt){
        $ipt.addEventListener('keyup',this.on_keyup);
        $ipt.addEventListener('focus',this.reset_ipt);
    }//add_on_keyup

    reset_ipt = (e)=>{
        const $ipt = e.target;
        const val = $ipt.value; 
        if(val == this.error){
            $ipt.value = '';
            return;
        }//if

        switch($ipt.id){
            case this.mm :
                const last_mm = val.slice(-2);
                if(last_mm == " 원" || last_mm == "달러"){
                    const val_dd = Number(val.slice(0, -2).replaceAll(',',''));
                    $ipt.value = val_dd;
                }//if
                break;
            case this.dj :
                const last_dj = val.slice(-3);
                if(last_dj == "딘자린"){
                    // console.log(val.slice(0,-3));
                    const val_dj = Number(val.slice(0,-3));
                    $ipt.value = val_dj;
                }//if
                break;
        }//switch
    }//reset_ipt
    
    on_keyup = (e)=>{
        const $ipt = e.target;
        const val = Number($ipt.value);
        /* NaN 일 때 */
        if(isNaN(val)){
            this.nan($ipt);
            return;
        }//if

        /* 제대로 된 숫자 일때 */
        switch($ipt.id){
            case this.mm :
                this.mm_to_dj(val);
                break;
            case this.dj :
                this.dj_to_mm(val);
                break;
        }//switch

        /* Enter 키일때 */
        if(e.key=="Enter"){
            if($ipt.id == this.mm){this.change_won();}
            if($ipt.id == this.dj){this.change_djarin();}
        }//if
    }//on_keyup

    nan($ipt){
        this.display_nan_message($ipt.id == this.dj ? this.mm : this.dj);
    }//nan

    display_nan_message(name){
        const $ipt = document.getElementById(name);
        $ipt.value = this.error;
    }//display_nan_message

    mm_to_dj(val){
        const $ipt = document.getElementById(this.dj);
        const is_dollar = this.$sel_mm.value == 'dollar';
        const money = is_dollar ? val * this.DOLLAR : val;
        const q = (money / this.DJR).toFixed(2);
        const last = q.slice(-2);
        const final = last == "00" ? parseInt(q) : q;
        $ipt.value = `${final} 딘자린`;
    }//mm_to_dj

    change_won(){
        const $ipt = document.getElementById(this.mm);
        const val = Number($ipt.value).toLocaleString();
        const mName = this.money_name();
        $ipt.value = val + ' ' + mName;
    }//change_won

    change_djarin(){
        const $ipt = document.getElementById(this.dj);
        const val = Number($ipt.value).toLocaleString();
        $ipt.value = `${val} 딘자린`;
    }//change_djarin

    dj_to_mm(val){
        const $ipt = document.getElementById(this.mm);
        const money = this.money_rate(val);
        const mName = this.money_name();
        $ipt.value = `${money.toLocaleString()} ${mName}`;
    }//dj_to_mm

    money_rate(val){
        const won = val * this.DJR;
        const result = this.$sel_mm.value == 'dollar' ? (won / this.DOLLAR).toFixed(2) : won;
        return result
    }//money_rate

    money_name(){
        const result = this.$sel_mm.value == 'dollar' ? "달러" : "원";
        return result;
    }//money_name

    get_exchange_rate(){
        return fetch('https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD').then(res=>res.json()).then(data=>data[0].ttBuyingPrice);
    }//get_exchange_rate
}//class-DinCacul