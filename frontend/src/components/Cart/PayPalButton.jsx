import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider
            options={{
                "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, // Use environment variable
            }}
        >
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{ amount: { value: amount } }],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(onSuccess); // Ensure promise chaining
                }}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;