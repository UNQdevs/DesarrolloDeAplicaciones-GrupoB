package ar.edu.unq.desapp.grupob;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;

import ar.edu.unq.desapp.grupob.builders.BankAccountBuilder;

/**
 *
 * @author bananee
 *
 */
public class BankAccountTest {

    /**
     *
     */
    @Test
    public void testBankAccountConstructor() {
        BankAccountBuilder builder = BankAccountBuilder.aBankAccountBuilder();
        Bank bank = builder.withConsolidationPeriod(15).build();
        assertEquals(bank.getAccountBalance(), 0, 0);
        assertEquals(bank.getOperations().size(), 0);
        assertEquals(bank.getAvailable(), bank.getAccountBalance(), 0);
        assertEquals(bank.getAccrued(), 0, 0);
    }

    @Test
    public void testRemoveConsolidatedOperation() {
    	DateTime date = DateTime.parse("2014-09-01T01:00");
        Operation operation = mock(Operation.class);
        when(operation.getAmount()).thenReturn((double) 100);
        when(operation.getDate()).thenReturn(date);
        BankAccountBuilder builder = BankAccountBuilder.aBankAccountBuilder();
        Bank bank = builder.withConsolidationPeriod(6)
        		.build();
        bank.removeOperation(operation);
        assertFalse(bank.getOperations().contains(operation));
        assertEquals(bank.getAccountBalance(), 0,0);
    }
}
