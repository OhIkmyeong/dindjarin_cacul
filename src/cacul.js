export class DinCacul{
    constructor(){
        this.mm = 'ipt-mm';
        this.dd = 'ipt-dd';
        this.djarin = 45000;
        this.dollar = undefined;
        this.$sel_mm = document.getElementById('sel-mm');
        this.error = '숫자를 제대로 입력해주세요';
    }

    async init(){
        //fetch 해서 환율 등록
        this.dollar = await this.get_exchange_rate();

        //ipt에 keyup 이벤트 등록
        const $$ipt = document.querySelectorAll('.ipt');
        for(let $ipt of $$ipt){this.add_on_keyup($ipt);}
    }//init

    add_on_keyup($ipt){
        $ipt.addEventListener('keyup',this.on_keyup);
        $ipt.addEventListener('focus',this.reset_ipt);
    }//add_on_keyup

    reset_ipt = (e)=>{
        const $target = e.target;
        if($target.value == this.error){$target.value = '';}
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
                this.mm_to_dd(val);
                break;
            case this.dd :
                this.dd_to_mm(val);
                break;
        }//switch
    }//on_keyup

    nan($ipt){
        this.display_nan_message($ipt.id == this.dd ? this.mm : this.dd);
    }//nan

    display_nan_message(name){
        const $ipt = document.getElementById(name);
        $ipt.value = this.error;
    }//display_nan_message

    mm_to_dd(val){
        const $ipt = document.getElementById(this.dd);
        const is_dollar = this.$sel_mm.value == 'dollar';
        const money = is_dollar ? val * this.dollar : val;
        const q = (money / this.djarin).toFixed(2);
        const last = q.slice(-2);
        const final = last == "00" ? parseInt(q) : q;
        $ipt.value = `${final} 딘자린`;
    }//mm_to_dd

    dd_to_mm(val){
        const $ipt = document.getElementById(this.mm);
        const money = this.money_rate(val);
        const mName = this.money_name();
        $ipt.value = `${money} ${mName}`;
    }//mm_to_dd

    money_rate(val){
        const won = val * this.djarin;
        const result = this.$sel_mm.value == 'dollar' ? (won / this.dollar).toFixed(2) : won;
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