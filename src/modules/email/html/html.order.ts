import { Order } from 'src/modules/orders/entities/order.entity';

const OrderSuccessEmailHTML = (email: string, order: Order): string => {
  const productRows = order.order_details
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 0;">
            <img src="${JSON.parse(item.image)[0]}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 10px;" />
          </td>
          <td style="padding: 10px 0;">
            <div style="font-weight: bold; color: #0d47a1;">${item.name}</div>
            <div style="font-size: 13px; color: #1976d2;">${item.quantity} x $${item.price.toFixed(2)}</div>
          </td>
        </tr>
      `,
    )
    .join('');

  return `<div style="background-color: #e3f2fd; padding: 40px; font-family: 'Segoe UI', sans-serif; color: #0d47a1;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15); border: 1px solid #90caf9;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/891/891419.png" alt="NextMerce Logo" width="60" style="margin-bottom: 10px;" />
          <h2 style="margin: 0; color: #1565c0;">Order Confirmed</h2>
          <p style="font-size: 14px; color: #1976d2;">Thank you for shopping with NextMerce!</p>
        </div>
  
        <!-- Greeting -->
        <p style="font-size: 16px; line-height: 1.6;">
          Hi <strong>${order.receiver}</strong>,
        </p>
  
        <p style="font-size: 16px; line-height: 1.6;">
          We have received your order successfully. Here are your order details:
        </p>
  
        <!-- Order Summary -->
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="font-size: 14px; margin-bottom: 10px; color: #1565c0;">Order ID: <strong>#${order.id}</strong></p>
          <p style="font-size: 14px; margin-bottom: 10px; color: #1565c0;">Order Date: ${order.createdAt.toLocaleDateString()}</p>
          <p style="font-size: 14px; margin-bottom: 10px; color: #1565c0;">Delivery Address: ${order.delivery_address}</p>
          <p style="font-size: 14px; color: #1565c0;">Phone: ${order.receiver_phone}</p>
        </div>
  
        <!-- Products List -->
        <div style="margin: 20px 0;">
          <h3 style="color: #1565c0; font-size: 18px;">Products</h3>
          <table style="width: 100%; border-spacing: 0 10px;">
            ${productRows}
          </table>
        </div>
  
        <!-- Price Summary -->
        <div style="margin: 20px 0;">
          <p style="font-size: 16px; color: #0d47a1;">Subtotal: <strong>$${order.subTotal.toFixed(2)}</strong></p>
          <p style="font-size: 18px; color: #1565c0;">Total: <strong>$${order.total.toFixed(2)}</strong></p>
          <p style="font-size: 14px; color: #1976d2;">Payment Method: <strong>${order.payment.name}</strong></p>
        </div>
  
        <hr style="border: none; border-top: 1px solid #bbdefb; margin: 40px 0;">
  
        <!-- Footer -->
        <p style="font-size: 13px; color: #1976d2;">
          If you have any questions about your order, feel free to contact us at <a href="mailto:support@nextmerce.com" style="color: #1565c0;">support@nextmerce.com</a>.
        </p>
        <p style="font-size: 13px; color: #1976d2;">
          Best regards,<br />
          <strong>NextMerce Team</strong>
        </p>
  
        <div style="text-align: center; font-size: 12px; color: #90a4ae; margin-top: 30px;">
          <p>© ${new Date().getFullYear()} NextMerce. All rights reserved.</p>
        </div>
      </div>
    </div>`;
};

export default OrderSuccessEmailHTML;
