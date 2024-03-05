import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Divider from "@site/src/components/Layout/Divider";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";

/* TODO: content here is included via iframe from a static site, not pretty */

export default function FollowCardanoSection() {
  return (
    <BoundaryBox>
      <Divider text="Stats" />
      <TitleWithText
        title="Stats"
        description={[
          "The four tranches of the distribution are shown with the number of individual ada vouchers distributed that \
            took place during each stage, and the proportion of the overall distribution that occurred during that particular \
            tranche. The sum taken during each tranche is viewable in Bitcoin, ada or the equivalent in US dollars. \
            (All ada voucher holder transactions were made in Bitcoin, or by Yen converted into Bitcoin, to enable transparent \
              blockchain accounting.) The proportion of ada voucher holders from each region is shown, along with the average \
              size of vouchers held, and there is also information on distributors.",
        ]}
        titleType="black"
        headingDot={true}
      />
      <iframe
        className={styles.statsFrame}
        scrolling="no"
        src="https://static.iohk.io/adasale/"
      ></iframe>
      <h3>Post-Commission Exodus Addresses</h3>
      <div class="exodusTable">
        <table>
          <tbody>
            <tr>
              <td>Tranche 1</td>
              <td>
                <a
                  href="https://blockchain.info/address/3LZU6nDHGFfNrcs15qZcPA7xDDMHBbDN28"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blockchain.info/address/3LZU6nDHGFfNrcs15qZcPA7xDDMHBbDN28
                </a>
              </td>
            </tr>
            <tr>
              <td>Tranche 2</td>
              <td>
                <a
                  href="https://blockchain.info/address/37UmWw8rQpmomsHmq62AiE6EXgbi59UFAe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blockchain.info/address/37UmWw8rQpmomsHmq62AiE6EXgbi59UFAe
                </a>
              </td>
            </tr>
            <tr>
              <td>Tranche 3a</td>
              <td>
                <a
                  href="https://blockchain.info/address/37jFLuEE5E7Cg3H72GQyDbkBGPgfeT4jYW"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blockchain.info/address/37jFLuEE5E7Cg3H72GQyDbkBGPgfeT4jYW
                </a>
              </td>
            </tr>
            <tr>
              <td>Tranche 3b</td>
              <td>
                <a
                  href="https://blockchain.info/address/38fsdtpzNv1nsoc4ho9wDBBdtqHCy72wKR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blockchain.info/address/38fsdtpzNv1nsoc4ho9wDBBdtqHCy72wKR
                </a>
              </td>
            </tr>
            <tr>
              <td>Tranche 4</td>
              <td>
                <a
                  href="https://blockchain.info/address/3KJUJUQS3XwYiiZ9uzVdqJwbnnUjPYLcmy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  blockchain.info/address/3KJUJUQS3XwYiiZ9uzVdqJwbnnUjPYLcmy
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Divider text="Audit" />
      <TitleWithText
        title="Ada Distribution Audit"
        description={[
          "From September 2015 to January 2017 a pre-launch sales event of cryptocurrency token 'ada' was undertaken. The sales event \
          covered five specific periods, referred to as ‘tranches’ (T1/T2/T3/T3.5/T4). The principal party retained Attain Corporation \
          of Japan to manage the sale of ada ‘vouchers’ that could be exchanged into ada tokens after the platform launch. Subsequently, \
          the Cardano Foundation performed three separate audits into the sales operation. These audits were a bespoke hybrid of operational \
          and financial audit approaches. The first audit covered T1 & T2, the second covered T3/T3.5 and the third covered T4. Finally, \
          an overall summary document was created. The core task was to produce an objective study of how sales were progressing and to \
          check on adherence to contractual terms between the parties. The Cardano Foundation interviewed representatives of Attain \
          Corporation both in the UK and Japan. It has had full independent access to the source data. Where appropriate, the Cardano \
          Foundation offered its best advice to improve processes and internal operations. Each audit had the same broad scope:",

          {
            list: [
              "**Proceeds of sale review** – reconciliation of funds received during the sales event",
              "**Customer sales analysis** - checks for suspicious customer activity during the sale",
              "**Distributor activity analysis** – check for any evidence of distributor malpractice or fraud",
              "**Check for KYC (Know Your Customer) adherence** – assess whether agreed KYC procedures were applied by Attain",
              "**Review of Attain as an entity** – perform operational checks for good internal governance",
            ],
          },

          "The sale proceeds were entirely in bitcoin, although some purchases were exchanged from Yen to Bitcoin as part of the sales \
          transaction process. Cardano Foundation’s findings were as follows:",

          "**Proceeds of Sale Review** Cardano Foundation performed a full comparison between sales reported on Attain’s internal sales \
          database and compared that to the amounts received at the end of the process. Transparent sale accounting was enabled by use of \
          the publically available bitcoin ‘blockchain’ to process sales and receipts. This information could therefore be ratified against \
          accounting entries in Attain’s sales database. This comparison gave the Cardano Foundation a high degree of confidence that the \
          sales proceeds had been reported in a full and fair manner. The final total of bitcoins received and visible on the blockchain \
          agreed with the total bitcoin reported in Attains Sales database agreed with an error margin of less than 0.01%.",

          "**Perform a Customer Sales Analysis** Cardano Foundation looked at sales patterns and searched for inconsistencies in the data. \
          During the first audit, which covered the first two sales tranches, some cases were identified where distributors were purchasing \
          on behalf of customers. This meant their customers were not being onboarded with the necessary KYC checks. Cardano Foundation \
          reported they saw evidence that these distributors were subsequently suspended from further trading and observed that considerable \
          effort was applied to ensure these individual purchasers were onboarded or refunded.",

          "**Perform a Distributor Activity Analysis** Cardano Foundation did not find any material issues of concern with the distributors \
          general activity, other than reported above.",

          "**Check for Know Your Customer (KYC) standards adherence** Cardano Foundation reported that they believed this is the first time a \
          cryptocurrency offering has required KYC in order to participate both as a purchaser and/or distributor. In this regard, the sale \
          is industry leading and goes significantly beyond other cryptocurrency offerings to ensure a good source of funds for the project.",

          "During the first and second tranches, Cardano Foundation reported some failings in the KYC onboarding process, such as missing \
          documents or inconsistent data. Attain demonstrated that they worked to correct these earlier errors and tighten the procedures in \
          later sales tranches. Cardano Foundation report that the KYC adherence for purchasers improved significantly as the sales tranches \
          progressed. The KYC adherence results were particularly strong in tranche 4, demonstrating improved rigour in operational practices \
          as Attains level of experience in managing this process grew.",

          "**Review of Attain as an entity** Cardano Foundation reported that, in their view, Attain had demonstrated an awareness of their \
          obligations and duties of care and have well established operational procedures performed by a dedicated team.",

          "Below are the sales statistics Cardano Foundation reported in the final audit, updated to include refunds processed and final \
          database reconciliations;",

          "Below tables shows the total sales summary for all tranches:",
        ]}
        titleType="black"
        headingDot={true}
      />
      <table className={styles.statsTable}>
        <tbody>
          <tr className={styles.tableHeader}>
            <td class="left-align">Tranche</td>
            <td># of paid invoices</td>
            <td>Bitcoin Received (inc Yen)</td>
            <td>Amount paid (Yen)</td>
            <td>Net $ cost (inc BTC &amp; Yen sales)</td>
            <td>Total # of ADA Sold</td>
          </tr>
          <tr>
            <td class="left-align">T1</td>
            <td>277</td>
            <td>9080.1</td>
            <td>128,687,124</td>
            <td>2,510,213</td>
            <td>1,255,160,024</td>
          </tr>
          <tr>
            <td class="left-align">T2</td>
            <td>4100</td>
            <td>40202.2</td>
            <td>1,222,041,982</td>
            <td>17,005,659</td>
            <td>7,729,842,852</td>
          </tr>
          <tr>
            <td class="left-align">T3</td>
            <td>2903</td>
            <td>24278.9</td>
            <td>696,502,791</td>
            <td>14,217,054</td>
            <td>5,923,771,020</td>
          </tr>
          <tr>
            <td class="left-align">T3.5</td>
            <td>301</td>
            <td>2462.6</td>
            <td>764,054</td>
            <td>1,732,677</td>
            <td>721,948,412</td>
          </tr>
          <tr>
            <td class="left-align">T4</td>
            <td>6821</td>
            <td>32820.7</td>
            <td>1,015,304,038</td>
            <td>26,770,532</td>
            <td>10,296,348,230</td>
          </tr>
          <tr>
            <td class="left-align">Total</td>
            <td>14402</td>
            <td>108844.5</td>
            <td>3,063,299,989</td>
            <td>62,236,134</td>
            <td>25,927,070,538</td>
          </tr>
        </tbody>
      </table>
      <SpacerBox size="small" />
      Below table summarizes total sales by country, by tranche in Bitcoin (BTC)
      received: <br />
      <br />
      <table className={styles.statsTable}>
        <tbody>
          {/*<tr className={styles.tableHeader}>
            <td>Sum of BTC</td>
            <td>Tranche &gt;&gt;</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>*/}
          <tr className={styles.tableHeader}>
            <td class="left-align">Country</td>
            <td>T1</td>
            <td>T2</td>
            <td>T3</td>
            <td>T3.5</td>
            <td>T4</td>
            <td>Grand Total</td>
            <td>% Of Sale</td>
          </tr>
          <tr>
            <td class="left-align">JP</td>
            <td>9080.1</td>
            <td>40189.3</td>
            <td>24278.9</td>
            <td>456.8</td>
            <td>28798.7</td>
            <td>102803.8</td>
            <td>94.45%</td>
          </tr>
          <tr>
            <td class="left-align">KR</td>
            <td></td>
            <td>10.6</td>
            <td></td>
            <td>708.8</td>
            <td>2064.9</td>
            <td>2784.4</td>
            <td>2.56%</td>
          </tr>
          <tr>
            <td class="left-align">CN</td>
            <td></td>
            <td></td>
            <td></td>
            <td>1175.5</td>
            <td>1429.2</td>
            <td>2604.6</td>
            <td>2.39%</td>
          </tr>
          <tr>
            <td class="left-align">TH</td>
            <td></td>
            <td></td>
            <td></td>
            <td>5.4</td>
            <td>450.7</td>
            <td>456.1</td>
            <td>0.42%</td>
          </tr>
          <tr>
            <td class="left-align">MY</td>
            <td></td>
            <td>2.3</td>
            <td></td>
            <td>100.3</td>
            <td>3.9</td>
            <td>106.5</td>
            <td>0.10%</td>
          </tr>
          <tr>
            <td class="left-align">PH</td>
            <td></td>
            <td></td>
            <td></td>
            <td>8.4</td>
            <td></td>
            <td>8.4</td>
            <td>0.01%</td>
          </tr>
          <tr>
            <td class="left-align">TW</td>
            <td></td>
            <td></td>
            <td></td>
            <td>7.4</td>
            <td></td>
            <td>7.4</td>
            <td>0.01%</td>
          </tr>
          <tr>
            <td class="left-align">VN</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>73.3</td>
            <td>73.3</td>
            <td>0.07%</td>
          </tr>
          <tr>
            <td class="left-align">Grand Total</td>
            <td>9080.1</td>
            <td>40202.2</td>
            <td>24278.9</td>
            <td>2462.6</td>
            <td>32820.7</td>
            <td>108844.5</td>
            <td>100%</td>
          </tr>
        </tbody>
      </table>
      <SpacerBox size="small" />
      Below table shows the spread of sales by tranche, by age demographic group
      for all tranches: <br />
      <br />
      <table className={styles.statsTable}>
        <tbody>
        {/*<tr className={styles.tableHeader}>
            <td>Purchases By Age</td>
            <td>Tranche &gt;&gt;</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        */}
          <tr className={styles.tableHeader}>
            <td class="left-align">Age Range</td>
            <td>T1</td>
            <td>T2</td>
            <td>T3</td>
            <td>T3.5</td>
            <td>T4</td>
            <td>Grand Total</td>
          </tr>
          <tr>
            <td class="left-align">under 25</td>
            <td>$529,860</td>
            <td>$513,747</td>
            <td>$189,321</td>
            <td>$168,626</td>
            <td>$362,837</td>
            <td>$1,764,391</td>
          </tr>
          <tr>
            <td class="left-align">25 – 34</td>
            <td>$338,785</td>
            <td>$2,819,273</td>
            <td>$2,080,465</td>
            <td>$309,067</td>
            <td>$8,207,037</td>
            <td>$13,754,626</td>
          </tr>
          <tr>
            <td class="left-align">35 – 44</td>
            <td>$954,120</td>
            <td>$6,332,533</td>
            <td>$4,316,665</td>
            <td>$327,953</td>
            <td>$8,501,121</td>
            <td>$20,432,392</td>
          </tr>
          <tr>
            <td class="left-align">45 – 54</td>
            <td>$197,589</td>
            <td>$3,660,939</td>
            <td>$3,534,050</td>
            <td>$992,163</td>
            <td>$6,117,650</td>
            <td>$14,502,391</td>
          </tr>
          <tr>
            <td class="left-align">55 – 64</td>
            <td>$183,058</td>
            <td>$2,816,849</td>
            <td>$3,185,516</td>
            <td>$123,433</td>
            <td>$2,677,260</td>
            <td>$8,986,116</td>
          </tr>
          <tr>
            <td class="left-align">65+</td>
            <td>$315,480</td>
            <td>$1,061,187</td>
            <td>$1,059,494</td>
            <td>$8,971</td>
            <td>$1,108,565</td>
            <td>$3,553,697</td>
          </tr>
          <tr>
            <td class="left-align">Grand Total</td>
            <td>$2,518,893</td>
            <td>$17,204,527</td>
            <td>$14,365,511</td>
            <td>$1,930,213</td>
            <td>$26,974,470</td>
            <td>$62,993,614</td>
          </tr>
        </tbody>
      </table>
      <SpacerBox size="medium" />
    </BoundaryBox>

    
  );
}
