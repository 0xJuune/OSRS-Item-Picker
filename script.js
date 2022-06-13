let timestep = '1h'
let itemId = null
// const metadataUrl = 'https://chisel.weirdgloop.org/gazproj/gazbot/os_dump.json'
// const priceHistoryUrl = `https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${itemId}`
// const dailyAvg = 'https://prices.runescape.wiki/api/v1/osrs/24h'
const metadataUrl = '/os_dump.json'
// const priceHistoryUrl = `/timeseries.json`
const dailyAvg = '/24h.json'

const dataFetch = (() => {
    let arrHighVolumeItems = []
    let arrMarginPairs = []
    // let historicalMargin = []

    // this function grabs item info and sorts by highest volume, 
    // only keeping entries over 500,000.
    const createMetaData = async () => { 
        // const metadataUrl = 'https://chisel.weirdgloop.org/gazproj/gazbot/os_dump.json'
        const response = await fetch(metadataUrl);
        const data = await response.json();
        const values = Object.values(data)
        
        let arrMetaData = values.sort((a, b) => {
            return a.volume - b.volume;
        });

        const reversed = arrMetaData.reverse();
        const filtered = reversed.filter(
            function(e) {return e.volume > 500000;}
        )
           
        filtered.forEach(element => {
            arrHighVolumeItems.push(element.id);
        });

    }

    const createMarginPairs = async () => {
        const response = await fetch(dailyAvg);
        const data = await response.json();
        let arrDataCopy = data.data;
        let values = Object.values(arrDataCopy);
    
        // this is margin calc
        arrHighVolumeItems.forEach(element => {
            arrDataCopy[element].id = element;
            marginRemainder = arrDataCopy[element].avgHighPrice - arrDataCopy[element].avgLowPrice;
            arrDataCopy[element].dailyMargin = Math.abs(marginRemainder);
        });
    
        // console.log(arrDataCopy[1747].dailyMargin)
        
        let filtered = values.filter(
            function(e) {return e.dailyMargin != null;}
        )
        
        let sortedMargin = filtered.sort((a, b) => {
            return b.dailyMargin - a.dailyMargin;
        })

        sortedMargin.forEach(e => {
            arrMarginPairs.push([e.id, e.dailyMargin])
            // console.log(`ID: ${e.id} | 24 Hour Margin: ${e.dailyMargin} `)
        });
        
    //     for (let i = 0; i < 5; i++) {
    //     // arrMarginStuff.push([sortedMargin[i].id, sortedMargin[i].dailyMargin])
    //     // console.log(`id: ${sortedMargin[i].id} volume: ${sortedMargin[i].dailyMargin} `)
    // }
    
        // console.log(sortedMargin)
        // console.log(arrMarginPairs)
        getHistoricalMargin()
    }

    const getHistoricalMargin = async () => {
        for (let i = 0; i < 5; i++) {
            itemId = arrMarginPairs[i][0]
            const priceHistoryUrl = `https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=${timestep}&id=${itemId}`
            const response = await fetch(priceHistoryUrl);
            const data = await response.json();
            let values = Object.values(data.data);
            let arrCalc = []
            let count = []
            let countTwo = []
            const CountStep = function(margin, quantity) {
                this.margin = margin;
                this.quantity = quantity;
            }
            
            values.forEach(e => {
                let difference = e.avgHighPrice - e.avgLowPrice;
                difference = Math.abs(difference);
                arrCalc.push(difference);      
            });
            
            arrCalc.forEach(e => {
                count[e] = (count[e] || 0) + 1;
            })

            let j = 0
            count.forEach(e => {
                countTwo[j] = new CountStep(j, e)
                j++;
            })

            countTwo.sort((a, b) => {
                return b.quantity - a.quantity;
            })



            // console.log(count)
            // console.log(arrCalc)
            // historicalMargin[i] = []
            console.log(`Item ID: ${arrMarginPairs[i][0]} | Current Margin: ${arrMarginPairs[i][1]}gp | Top 5 Historical Margin Points: ${countTwo[0].margin}gp ${countTwo[1].margin}gp ${countTwo[2].margin}gp ${countTwo[3].margin}gp ${countTwo[4].margin}gp`)
            console.log(countTwo)
        }
    }


    // const createPriceData = async () => {
        // 
    // }

    // const = async () => {
        createMetaData() 
        createMarginPairs()
        // getHistoricalMargin()
    // }




    return {

    }
})();


//grab metadata
// class item {
//     constructor(id, name, description, members, limit, icon, volume, highPrice, lowPrice) {
//         this.id = id;
//         this.name = name;
//         this.description = description;
//         this.members = members;
//         this.limit = limit;
//         this.icon = icon;
//         this.volume = volume;
//         this.highPrice = highPrice;
//         this.lowPrice = lowPrice;
//         // this.price = price;

//         this.margin = null;
//     }
    
//     get id() {
//         return this.id
//     }
//     get name() {
//         return this.name
//     }
//     get description() {
//         return this.description
//     }
//     get members() {
//         return this.members
//     }
//     get limit() {
//         return this.limit
//     }
//     get icon() {
//         return this.icon
//     }
//     get volume() {
//         return this.volume
//     }
//     get highPrice() {
//         return this.highPrice
//     }
//     get lowPrice() {
//         return this.lowPrice
//     }


// }

















// icons:
// https://github.com/runelite/static.runelite.net/tree/gh-pages/cache/item/icon

// metadata
// https://prices.runescape.wiki/api/v1/osrs/mapping
// i think this has the same data but w/ volume and pricing
// https://chisel.weirdgloop.org/gazproj/gazbot/os_dump.json

