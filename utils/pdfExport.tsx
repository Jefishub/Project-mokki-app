const ownerData = {
  name: 'Herra Omistaja',
  address: 'Mökinomistajantie 4',
  phone: '040-1234567',
  company: 'Mökkibisness Oy',
}

const constants = {
  baseCost: 10, // eur/day
  x_electricity: 10.68, // snt/kWh
  x_water: 4.05 // eur/m3
}

type userData = {
  nights: number,
  electricity: number,
  water: number
}

const HTMLcontentForPDF = (data: userData) => {
  const usageCost = data.nights*constants.baseCost;
  const electricityCost = data.electricity*constants.x_electricity/100;
  const waterCost = data.water*constants.x_water;
  const totaCost = usageCost + electricityCost + +waterCost;

  const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>Lasku</title>
            <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
            <style>
              ${htmlStyles}
            </style>
          </head>
          <body>
            <header>
              <h1>Lasku</h1>
              <address>
                <p>${ownerData.name}</p>
                <p>${ownerData.address}</p>
                <p>${ownerData.phone}</p>
              </address>
            </header>
            <article>
              <h1>Recipient</h1>
              <address>
                <p>${ownerData.company}<br>c/o ${ownerData.name}</p>
              </address>
              <table class="meta">
                <tr>
                  <th><span>Laskunumero #</span></th>
                  <td><span>${Math.floor(Math.random()*1000000)}</span></td>
                </tr>
                <tr>
                  <th><span>Päiväys</span></th>
                  <td><span>${new Date()}</span></td>
                </tr>
              </table>
              <table class="inventory">
                <thead>
                  <tr>
                    <th><span>Kulu</span></th>
                    <th><span>Selite</span></th>
                    <th><span>Hinta</span></th>
                    <th><span>Määrä</span></th>
                    <th><span>Summa</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span>Perusmaksu</span></td>
                    <td><span>Mökin käyttö</span></td>
                    <td><span>${constants.baseCost}</span><span> euroa/yö</span></td>
                    <td><span>${data.nights}</span></td>
                    <td><span>${usageCost}</span><span> eur</span></td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td><span>Sähkömaksu</span></td>
                    <td><span>Sähkönkulutus</span></td>
                    <td><span>${constants.x_electricity}</span><span> snt/kWh</span></td>
                    <td><span>${data.electricity}</span></td>
                    <td><span>${electricityCost}</span><span> eur</span></td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td><span>Vesimaksu</span></td>
                    <td><span>Vedenkulutus</span></td>
                    <td><span>${constants.x_water}</span><span> euroa/m3</span></td>
                    <td><span>${data.water}</span></td>
                    <td><span>${waterCost}</span><span> eur</span></td>
                  </tr>
                </tbody>
              </table>
              <table class="balance">
                <tr>
                  <th><span>Summa</span></th>
                  <td><span data-prefix>$</span><span>${totaCost}</span></td>
                </tr>
              </table>
            </article>
            <aside>
              <h1><span>Lisätiedot</span></h1>
              <div>
                <p>Myöhästyneestä laskusta 5 euron muistutusmaksu. Pidetään huoli maksuista.</p>
              </div>
            </aside>
          </body>
        </html>
      `;

  return htmlContent
}

export default HTMLcontentForPDF



const htmlStyles = `
*{
  border: 0;
  box-sizing: content-box;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  vertical-align: top;
}
h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }
/* table */
table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }
/* page */
html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; }
html { background: #999; cursor: default; }
body { box-sizing: border-box;margin: 0 auto; overflow: hidden; padding: 0.25in; }
body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }
/* header */
header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }
header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }
/* article */
article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }
article address { float: left; font-size: 125%; font-weight: bold; }
/* table meta & balance */
table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }
/* table meta */
table.meta th { width: 40%; }
table.meta td { width: 60%; }
/* table items */
table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }
table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }
/* table balance */
table.balance th, table.balance td { width: 50%; }
table.balance td { text-align: right; }
/* aside */
aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
aside h1 { border-color: #999; border-bottom-style: solid; }
`
