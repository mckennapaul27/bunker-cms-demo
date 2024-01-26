import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import { getSort } from '@/utils/table-helpers';
import { StickyHeader } from '@/components/collections/StickyHeader';
import Link from 'next/link';
import { TableWrapper } from '@/components/tables/TableWrapper';
import { blogColumnAttributes } from '@/utils/table-colums';
import Blog from '@/models/Blog';
import { EmptyState } from '@/components/loading/EmptyState';
export default async function ContentManagerPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const pageIndex = searchParams.pageIndex
        ? parseInt(searchParams.pageIndex)
        : 0;
    const pageSize = searchParams.pageSize
        ? parseInt(searchParams.pageSize)
        : 10;
    const query = searchParams.globalFilter
        ? JSON.parse(searchParams.globalFilter)
        : [];
    let sort = searchParams.sorting
        ? getSort({ sorting: JSON.parse(searchParams.sorting) })
        : getSort({ sorting: [{ id: 'createdAt', desc: true }] });

    let skippage = pageSize * pageIndex;
    const queryExpressions = query.map(
        (filter: { id: string; value: string | number }) => {
            return { [filter.id]: { $regex: filter.value, $options: 'i' } };
        }
    );

    await connectToDb();
    const combinedQuery =
        queryExpressions.length > 0 ? { $and: queryExpressions } : {};
    const totalCount = await Blog.countDocuments(combinedQuery);
    const totalCountWithoutQuery = await Blog.countDocuments();
    const data = await Blog.find(combinedQuery)
        .sort(sort)
        .skip(skippage)
        .limit(pageSize);

    return (
        <DashboardWrapper>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Blog</h1>
                    <p>{totalCount} entries found</p>
                </div>
                <div className={'actions'}>
                    <Link
                        href={'/dashboard/content-manager/blog/create'}
                        className="button small"
                    >
                        Create new entry
                    </Link>
                </div>
            </StickyHeader>
            {totalCountWithoutQuery > 0 ? (
                <TableWrapper
                    data={JSON.parse(JSON.stringify(data))}
                    pageCount={Math.ceil(totalCount / pageSize)}
                    totalCount={totalCount}
                    apiRoute={'/api/blogs'}
                    modelName={'Blog'}
                    filterOptions={[
                        { name: 'Title', id: 'title', isUnique: true },
                        { name: 'Slug', id: 'slug', isUnique: true },
                        { name: 'Status', id: 'status', isUnique: false },
                    ]}
                    columnAttributes={blogColumnAttributes}
                />
            ) : (
                <EmptyState name={'Blog'} />
            )}
        </DashboardWrapper>
    );
}

{
    /* <p
                style={{
                    maxWidth: '300px',
                }}
            >
                AstroPay Registration Guide & How To Get A Joining Bonus 2023
                Learn how to create an AstroPay account and get an amazing
                joining bonus which provides reduced fees, higher limits and
                cashback on your deposits. October 21, 2022, London AstroPay is
                a truly excellent e-money transfer service that's seen
                exponential growth over the years. The combination of extremely
                secure transactions, lighting-quick processing, and a broad
                range of services is the reason behind this. But if you want to
                join the ranks of AstroPay VIPs, you'll need to register first.
                And that's why we're here today - to talk about AstroPay
                registration. Today's Topics Include: How to Register for
                AstroPay (Step-by-Step) AstroPay Joining Bonus AstroPay +
                eWalletBooster Sign-Up Bonus Finding Your AstroPay Account ID
                AstroPay Registration FAQ Do I need ID to register for AstroPay?
                Do I need a credit/debit card to register for AstroPay? How old
                do I need to be to use AstroPay? Does AstroPay require a bank
                account? Further Reading Okay - it's registration time. How to
                Register for AstroPay (Step-by-Step) As with most things on
                AstroPay, they've done an excellent job of streamlining the
                registration process. This is slightly different from other,
                similar services' registration processes, but it's still quite
                simple. Keep in mind that you'll need all of the following, as
                it will be verified farther down the line: A functional email
                (the same you use for eWalletBooster) A valid phone number Date
                of birth First & last name The phone number is the most
                important part, though - the rest are mainly just formalities.
                Now - here's how to register an AstroPay account: Click here.
                Enter your phone number and area code. Your phone will be sent a
                Two-Factor Authentication (2FA) code. Enter the code. Create a
                secure password and enter the information that's prompted
                (listed above). Click "Finish." That's it! Now, you're just
                waiting for a confirmation email. After you've received a
                confirmation email, you can move on to verifying your account,
                and you'll have a fully unlocked AstroPay account in no time!
                AstroPay Joining Bonus AstroPay is a great service, but that
                doesn't mean that we don't like being rewarded for using new
                services. While it's sad to say, the unfortunate truth is that
                AstroPay does not have a joining bonus of any form. (Though they
                do have an excellent VIP programme once you're started...)
                Nonetheless, that's not the end of the story. Keep reading to
                see how eWalletBooster can reward you for simply signing up with
                AstroPay - for free. AstroPay + eWalletBooster Sign-Up Bonus
                Okay - so why, exactly would you want to connect your AstroPay
                and eWalletBooster accounts? It's simple - rewards: Reduced fees
                (P2P, FX) Higher account limits Free AstroPay Instant Black VIP
                1.00-1.80% AstroPay VIP Cashback 0.25-0.40% ewalletbooster
                cashback Free verification (vs $10) Fast-tracked verification
                (12 hours vs. up to 3 days) Refer-a-friend rewards Exclusive
                eWalletBooster Rewards Dashboard And best of all, it takes
                pretty much nothing on your end. You simply enter your AstroPay
                account ID, your name, email, and country/preferred currency,
                and you're set! Seriously - it's free money. Why are you still
                waiting? Get AstroPay Cashback Now. Finding Your AstroPay
                Account ID To find your AstroPay account ID follow the below
                steps: Step 1: Log In To AstroPay Step 2: Click My account
                AstroPay Step 3: Click My Info AstroPay Step 4: Click Account
                Details AstroPay Step 5: Locate your User ID AstroPay AstroPay
                Registration FAQ This next section is pretty straightforward -
                you have questions, and we answer them. Let's not waste time. Do
                I need an ID to register for AstroPay? While you don't need an
                ID to register for AstroPay, you'll need it for verification.
                Without verifying your account, you'll be unable to use many of
                AstroPay's services, and will have a heavily restricted account.
                So, while the answer is technically no, the truth is that you'll
                need one sooner rather than later. Do I need a credit/debit card
                to register for AstroPay? No! You don't need a credit or debit
                card to register for AstroPay. This is part of why AstroPay is
                so popular across the globe; a lack of access to credit/debit
                cards or a bank account is only a minor hurdle with AstroPay
                rather than a world-ending inconvenience. How old do I need to
                be to use AstroPay? All AstroPay users must be at least eighteen
                (18) years of age to use the platform's services. Does AstroPay
                require a bank account? AstroPay does not require a bank
                account, just as they don't require a credit or debit card.
                However, it's worth noting that you'll need the means to upload
                and withdraw funds, so you'll need something. Luckily, AstroPay
                offers a massive swathe of potential payment options, with or
                without a bank account. Further Reading If you have further
                questions related to AstroPay, we suggest reading the following
                articles: AstroPay Verification AstroPay Fees & Limits AstroPay
                VIP Programme AstroPay Review Free AstroPay Bonus Get a FREE
                BLACK VIP Upgrade on Your AstroPay account with eWalletBooster.
                arrow right iconGet AstroPay “Black Level” status for FREE arrow
                right icon1.00-1.80% AstroPay VIP Cashback arrow right iconFREE
                P2P transfers arrow right iconFREE Verification (no deposit
                required!) arrow right iconPriority verification GET YOUR BLACK
                VIP ACCOUNT NOW promo-banner-img-vip.png CATEGORIES AstroPay
                Related articles The Top 8 Betting Companies for Cricket in
                India to try in 2023 Cricket's exhilaration meets intense
                betting in India's vast market. Amid Bet365's exit, we unveil
                the best 8 betting sites, catering to preferences and featuring
                the pioneering AstroPay payment for an enhanced wagering
                journey. Unlock Exclusive Benefits with AstroPay's VIP Loyalty
                Program Unlock exclusive benefits and rewards with AstroPay's
                VIP Loyalty Program. Earn AstroCoins for various actions and
                reach higher VIP levels to enjoy increased cashback, VIP
                experiences and a range of perks. PLUS: Discover how to get
                Black VIP from day one. Best Casinos Accepting AstroPay 2022 +
                Free Cashback! Discover the best casinos that accept AstroPay
                and how eWalletBooster can provide cashback on your deposits and
                a host of other bonuses!
            </p> */
}
