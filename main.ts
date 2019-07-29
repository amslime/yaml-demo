import * as yaml from "js-yaml"
import * as fs from "fs-extra"

async function main1() {
    const ret = yaml.safeLoad(fs.readFileSync('./example.yml', 'utf8'))
    console.log("object = ")
    console.log(JSON.stringify(ret))
    const ret2 = yaml.safeDump(ret)
    console.log("yaml string = ")
    console.log(ret2)

    const ret3 = yaml.safeDump({name: "tom", isAlive: true, stats: [3,3,6,4,5]})
    console.log("yaml string = ")
    console.log(ret3)

}


async function main2() {
    try {
        const ret = yaml.safeLoad(fs.readFileSync('./type.yml', 'utf8'))
        console.log(ret)
    } catch (err) {
        // go to here
        console.log("there's an error")
    }
}

async function main3() {

    // START: added self defined schema
    class P {
        constructor(public x: number ,public y: number) {}
    }
    class MT {
        constructor(public id: number ,public stat: P) {}
    }
    const pair = new yaml.Type('!pair_number', {
        kind: 'sequence',
        resolve: function (data) {
            return data !== null && data.length === 2;
        },
        construct: function (data) {
            return new P(data[0], data[1])
        },
        instanceOf: P,
        represent: function (data: P) {
            return ["represennt hacked"];
        }
    })
    const myType = new yaml.Type('!my_type', {
        kind: 'mapping',
        resolve: function (data) {
            return data.pair_number !== null && data.id !== null
        },
        construct: function (data) {
            return new MT(data.id, data.stat)
        },
        instanceOf: MT,
        represent: function (data:MT) {
            return data
        }
    })
    // END: added self defined schema

    // create custom schema
    const mySchema = yaml.Schema.create([pair, myType]);

    try {
        const ret = yaml.safeLoad(fs.readFileSync('./type.yml', 'utf8'), {schema: mySchema})
        // now will log successfully with defined schema
        console.log(JSON.stringify(ret))

        const ret2 = yaml.safeDump(ret, {schema: mySchema})
        console.log("yaml string = ")
        // changed represent
        console.log(ret2)

    } catch (err) {
       
        console.log("there's an error")
    }
}


main1()
main2()
main3()